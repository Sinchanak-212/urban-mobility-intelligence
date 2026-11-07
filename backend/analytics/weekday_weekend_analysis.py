
from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, dayofweek, when, count, countDistinct, to_date, round
)

spark = (
    SparkSession.builder
    .appName("UMI_Weekday_Weekend_Analysis")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = (
    "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/"
    "processed/trips_with_zones"
)

df = spark.read.parquet(path)

# Classify each trip as weekday or weekend
classified = (
    df.withColumn("day_number", dayofweek(col("pickup_datetime")))
    .withColumn(
        "day_type",
        when(col("day_number").isin(1, 7), "Weekend")
        .otherwise("Weekday")
    )
    .withColumn("pickup_date", to_date(col("pickup_datetime")))
)

# Compare total trips and average trips per calendar day
comparison = (
    classified
    .groupBy("day_type")
    .agg(
        count("*").alias("total_trips"),
        countDistinct("pickup_date").alias("number_of_days")
    )
    .withColumn(
        "average_trips_per_day",
        round(col("total_trips") / col("number_of_days"), 0)
    )
    .orderBy("day_type")
)

print("\n===== WEEKDAY VS WEEKEND DEMAND =====")
comparison.show(truncate=False)

spark.stop()
