from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col,
    explode,
    hour,
    dayofweek,
    count,
    sum as spark_sum
)

# 1. Create Spark session
spark = (
    SparkSession.builder
    .appName("UMI_Anomaly_Pattern_Analysis")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .getOrCreate()
)

# 2. Read anomaly-enriched data from HDFS
input_path = (
    "hdfs://localhost:9000/user/sinchu/"
    "urban-mobility-intelligence/analytics/anomaly_detection"
)

df = spark.read.parquet(input_path)

print("\nTotal records:", df.count())

# 3. Analyse anomaly category distribution
print("\n========== ANOMALY CATEGORY DISTRIBUTION ==========")

category_summary = (
    df.filter(col("is_anomaly") == 1)
    .select(explode(col("anomaly_reasons")).alias("anomaly_category"))
    .groupBy("anomaly_category")
    .agg(count("*").alias("record_count"))
    .orderBy(col("record_count").desc())
)

category_summary.show(truncate=False)
# 4. Analyse anomalies by hour of day
print("\n========== ANOMALIES BY HOUR ==========")

hourly_anomalies = (
    df.filter(col("is_anomaly") == 1)
    .withColumn("pickup_hour", hour(col("pickup_datetime")))
    .groupBy("pickup_hour")
    .agg(count("*").alias("anomaly_count"))
    .orderBy("pickup_hour")
)

hourly_anomalies.show(24, truncate=False)
# 5. Analyse anomalies by day of week
print("\n========== ANOMALIES BY DAY OF WEEK ==========")

daily_anomalies = (
    df.filter(col("is_anomaly") == 1)
    .withColumn("day_number", dayofweek(col("pickup_datetime")))
    .groupBy("day_number")
    .agg(count("*").alias("anomaly_count"))
    .orderBy("day_number")
)

daily_anomalies.show(truncate=False)

# 6. Analyse anomalies by pickup borough
# 6. Calculate anomaly rate by pickup borough
print("\n========== ANOMALY RATE BY PICKUP BOROUGH ==========")

borough_rates = (
    df.filter(col("pickup_borough").isNotNull())
    .groupBy("pickup_borough")
    .agg(
        count("*").alias("total_trips"),
        spark_sum("is_anomaly").alias("anomaly_trips")
    )
    .withColumn(
        "anomaly_rate_percent",
        col("anomaly_trips") / col("total_trips") * 100
    )
    .orderBy(col("anomaly_rate_percent").desc())
)

borough_rates.show(truncate=False)

# 7. Analyse anomaly reasons by pickup borough
print("\n========== ANOMALY REASONS BY BOROUGH ==========")

borough_reason_analysis = (
    df.filter(col("is_anomaly") == 1)
    .select(
        "pickup_borough",
        explode(col("anomaly_reasons")).alias("anomaly_category")
    )
    .groupBy("pickup_borough", "anomaly_category")
    .agg(count("*").alias("record_count"))
    .orderBy("pickup_borough", col("record_count").desc())
)

borough_reason_analysis.show(50, truncate=False)

spark.stop()