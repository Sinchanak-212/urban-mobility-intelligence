from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, count, avg, min, max, percentile_approx, round
)

spark = (
    SparkSession.builder
    .appName("UMI_Travel_Behavior")
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

# Exclude non-positive distance and duration for this analysis
valid_trips = df.filter(
    (col("trip_miles") > 0)
    & (col("trip_time") > 0)
)

print("\n===== TRAVEL BEHAVIOUR SUMMARY =====")

valid_trips.select(
    count("*").alias("valid_trips"),
    round(avg("trip_miles"), 2).alias("average_distance_miles"),
    round(avg("trip_time") / 60, 2).alias("average_duration_minutes"),
    round(percentile_approx("trip_miles", 0.5), 2).alias("median_distance_miles"),
    round(percentile_approx("trip_time", 0.5) / 60, 2).alias("median_duration_minutes"),
    round(min("trip_miles"), 2).alias("minimum_distance"),
    round(max("trip_miles"), 2).alias("maximum_distance")
).show(truncate=False)

spark.stop()