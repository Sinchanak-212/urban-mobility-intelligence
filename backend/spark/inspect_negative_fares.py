from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, min, max, avg

spark = (
    SparkSession.builder
    .appName("UMI_Negative_Fare_Analysis")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

negative_fares = df.filter(col("base_passenger_fare") < 0)

print("\n===== NEGATIVE FARE SUMMARY =====")
negative_fares.agg(
    count("*").alias("record_count"),
    min("base_passenger_fare").alias("minimum_fare"),
    max("base_passenger_fare").alias("maximum_fare"),
    avg("base_passenger_fare").alias("average_fare")
).show()

print("\n===== SAMPLE NEGATIVE FARE RECORDS =====")
negative_fares.select(
    "pickup_datetime",
    "dropoff_datetime",
    "trip_miles",
    "trip_time",
    "base_passenger_fare",
    "tolls",
    "sales_tax",
    "driver_pay",
    "PULocationID",
    "DOLocationID"
).show(10, truncate=False)

spark.stop()
