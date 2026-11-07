from pyspark.sql import SparkSession
from pyspark.sql.functions import col, sum, when

spark = (
    SparkSession.builder
    .appName("UMI_Data_Quality_Check")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

checks = [
    ("zero_or_negative_distance", col("trip_miles") <= 0),
    ("zero_or_negative_duration", col("trip_time") <= 0),
    ("negative_base_fare", col("base_passenger_fare") < 0),
    ("dropoff_before_pickup", col("dropoff_datetime") < col("pickup_datetime")),
    ("request_after_pickup", col("request_datetime") > col("pickup_datetime")),
]

expressions = [
    sum(when(condition, 1).otherwise(0)).alias(name)
    for name, condition in checks
]

print("\n===== DATA QUALITY CHECK =====")
df.agg(*expressions).show(truncate=False)

spark.stop()
