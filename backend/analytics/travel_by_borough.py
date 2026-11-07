from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg, round

spark = (
    SparkSession.builder
    .appName("UMI_Travel_By_Borough")
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

boroughs = [
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island"
]

valid_trips = df.filter(
    (col("trip_miles") > 0)
    & (col("trip_time") > 0)
    & col("pickup_borough").isin(boroughs)
)

result = (
    valid_trips
    .groupBy("pickup_borough")
    .agg(
        count("*").alias("total_trips"),
        round(avg("trip_miles"), 2).alias("avg_distance_miles"),
        round(avg("trip_time") / 60, 2).alias("avg_duration_minutes")
    )
    .orderBy(col("avg_duration_minutes").desc())
)

print("\n===== TRAVEL BEHAVIOUR BY BOROUGH =====")
result.show(truncate=False)

spark.stop()