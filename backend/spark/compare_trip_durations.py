from pyspark.sql import SparkSession
from pyspark.sql.functions import col, unix_timestamp, abs as spark_abs

spark = (
    SparkSession.builder
    .appName("UMI_Compare_Trip_Durations")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

df = df.withColumn(
    "calculated_duration_seconds",
    unix_timestamp("dropoff_datetime") - unix_timestamp("pickup_datetime")
)

df = df.withColumn(
    "duration_difference",
    spark_abs(col("trip_time") - col("calculated_duration_seconds"))
)

print("\n===== RECORDED VS CALCULATED DURATION =====")

df.select(
    "trip_time",
    "calculated_duration_seconds",
    "duration_difference"
).summary().show(truncate=False)

print("\n===== RECORDS WITH DIFFERENCE ABOVE 60 SECONDS =====")

df.filter(
    col("duration_difference") > 60
).select(
    "pickup_datetime",
    "dropoff_datetime",
    "trip_time",
    "calculated_duration_seconds",
    "duration_difference"
).show(10, truncate=False)

spark.stop()
