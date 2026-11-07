from pyspark.sql import SparkSession
from pyspark.sql.functions import col

spark = (
    SparkSession.builder
    .appName("UMI_Inspect_Timestamp_Anomalies")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

print("\n===== REQUEST AFTER PICKUP: SAMPLE RECORDS =====")

df.filter(
    col("request_datetime") > col("pickup_datetime")
).select(
    "request_datetime",
    "pickup_datetime",
    "dropoff_datetime",
    "PULocationID",
    "DOLocationID",
    "trip_miles",
    "trip_time"
).show(10, truncate=False)

spark.stop()
