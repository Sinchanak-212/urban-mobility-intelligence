from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col,
    when,
    sum as spark_sum,
    count,
    array,
    size,
    filter as spark_filter
)

# 1. Create Spark session
spark = (
    SparkSession.builder
    .appName("UMI_Rule_Based_Anomaly_Detection")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .getOrCreate()
)

# 2. Read enriched trip data from HDFS
input_path = (
    "hdfs://localhost:9000/user/sinchu/"
    "urban-mobility-intelligence/processed/trips_with_zones"
)

df = spark.read.parquet(input_path)

print("\nTotal records:", df.count())

# 3. Define anomaly conditions
df_flagged = (
    df
    .withColumn(
        "invalid_distance",
        when(col("trip_miles") <= 0, 1).otherwise(0)
    )
    .withColumn(
        "invalid_duration",
        when(col("trip_time") <= 0, 1).otherwise(0)
    )
    .withColumn(
        "negative_fare",
        when(col("base_passenger_fare") < 0, 1).otherwise(0)
    )
    .withColumn(
        "request_after_pickup",
        when(
            col("request_datetime").isNotNull()
            & col("pickup_datetime").isNotNull()
            & (col("request_datetime") > col("pickup_datetime")),
            1
        ).otherwise(0)
    )
    .withColumn(
        "dropoff_before_pickup",
        when(
            col("dropoff_datetime") < col("pickup_datetime"),
            1
        ).otherwise(0)
    )
)

# 4. Create a list of anomaly reasons
df_flagged = df_flagged.withColumn(
    "anomaly_reasons",
    array(
        when(col("invalid_distance") == 1, "Invalid distance"),
        when(col("invalid_duration") == 1, "Invalid duration"),
        when(col("negative_fare") == 1, "Negative fare"),
        when(col("request_after_pickup") == 1, "Request after pickup"),
        when(col("dropoff_before_pickup") == 1, "Dropoff before pickup")
    )
)

# Remove null entries from the reason list
df_flagged = df_flagged.withColumn(
    "anomaly_reasons",
    spark_filter(col("anomaly_reasons"), lambda x: x.isNotNull())
)

# 5. Mark records containing at least one anomaly
df_flagged = df_flagged.withColumn(
    "is_anomaly",
    when(size(col("anomaly_reasons")) > 0, 1).otherwise(0)
)

# 6. Calculate anomaly summary
summary = df_flagged.agg(
    count("*").alias("total_records"),
    spark_sum("invalid_distance").alias("invalid_distance"),
    spark_sum("invalid_duration").alias("invalid_duration"),
    spark_sum("negative_fare").alias("negative_fare"),
    spark_sum("request_after_pickup").alias("request_after_pickup"),
    spark_sum("dropoff_before_pickup").alias("dropoff_before_pickup"),
    spark_sum("is_anomaly").alias("unique_anomaly_records")
)

print("\n========== ANOMALY DETECTION SUMMARY ==========")
summary.show(truncate=False)
# Save anomaly detection results to HDFS
output_path = (
    "hdfs://localhost:9000/user/sinchu/"
    "urban-mobility-intelligence/analytics/anomaly_detection"
)

df_flagged.write.mode("overwrite").parquet(output_path)

print("\nAnomaly detection results saved to:", output_path)
# 7. Show sample flagged records
print("\n========== SAMPLE ANOMALOUS RECORDS ==========")

df_flagged.filter(
    col("is_anomaly") == 1
).select(
    "PULocationID",
    "DOLocationID",
    "trip_miles",
    "trip_time",
    "base_passenger_fare",
    "anomaly_reasons"
).show(10, truncate=False)

spark.stop()