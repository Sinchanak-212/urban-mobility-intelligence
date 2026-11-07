from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, avg, min, max

spark = (
    SparkSession.builder
    .appName("UMI_Zero_Distance_Analysis")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

zero_distance = df.filter(col("trip_miles") == 0)

print("\n===== ZERO-DISTANCE RECORD ANALYSIS =====")
print("Zero-distance records:", zero_distance.count())

zero_distance.select(
    avg("trip_time").alias("average_duration_seconds"),
    min("trip_time").alias("minimum_duration_seconds"),
    max("trip_time").alias("maximum_duration_seconds")
).show()

print("\n===== SAMPLE ZERO-DISTANCE RECORDS =====")

zero_distance.select(
    "pickup_datetime",
    "dropoff_datetime",
    "trip_miles",
    "trip_time",
    "base_passenger_fare",
    "PULocationID",
    "DOLocationID"
).show(10, truncate=False)

spark.stop()
