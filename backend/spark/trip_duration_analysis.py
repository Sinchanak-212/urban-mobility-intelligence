from pyspark.sql import SparkSession
from pyspark.sql.functions import col

spark = (
    SparkSession.builder
    .appName("UMI_Trip_Duration_Analysis")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

print("\n===== TRIP DURATION PERCENTILES =====")

df.select("trip_time").where(
    col("trip_time").isNotNull()
).approxQuantile(
    "trip_time",
    [0.25, 0.50, 0.75, 0.90, 0.95, 0.99, 0.999],
    0.01
)

percentiles = df.approxQuantile(
    "trip_time",
    [0.25, 0.50, 0.75, 0.90, 0.95, 0.99, 0.999],
    0.01
)

for p, value in zip(
    ["25th", "50th", "75th", "90th", "95th", "99th", "99.9th"],
    percentiles
):
    print(f"{p} percentile: {value} seconds ({value / 60:.2f} minutes)")

print("\n===== TRIPS LONGER THAN 3 HOURS =====")

df.filter(
    col("trip_time") > 10800
).select(
    "pickup_datetime",
    "dropoff_datetime",
    "trip_time",
    "trip_miles",
    "base_passenger_fare"
).show(10, truncate=False)

spark.stop()
