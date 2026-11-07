from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, hour, avg, count, round
)

spark = (
    SparkSession.builder
    .appName("UMI_Duration_By_Hour")
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

valid_trips = df.filter(
    (col("trip_miles") > 0)
    & (col("trip_time") > 0)
)

result = (
    valid_trips
    .withColumn("pickup_hour", hour("pickup_datetime"))
    .groupBy("pickup_hour")
    .agg(
        count("*").alias("total_trips"),
        round(avg("trip_time") / 60, 2).alias("avg_duration_minutes"),
        round(avg("trip_miles"), 2).alias("avg_distance_miles")
    )
    .orderBy("pickup_hour")
)

print("\n===== TRAVEL DURATION BY PICKUP HOUR =====")
result.show(24, truncate=False)

spark.stop()