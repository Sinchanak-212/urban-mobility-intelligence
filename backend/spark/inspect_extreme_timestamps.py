from pyspark.sql import SparkSession
from pyspark.sql.functions import col, unix_timestamp

spark = (
    SparkSession.builder
    .appName("UMI_Inspect_Extreme_Timestamps")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

df = df.withColumn(
    "difference_seconds",
    unix_timestamp("pickup_datetime") - unix_timestamp("request_datetime")
)

print("\n===== EXTREME TIMESTAMP REVERSALS =====")

df.filter(
    col("difference_seconds") < -1800
).select(
    "request_datetime",
    "pickup_datetime",
    "dropoff_datetime",
    "PULocationID",
    "DOLocationID",
    "trip_miles",
    "trip_time",
    "difference_seconds"
).show(10, truncate=False)

spark.stop()
