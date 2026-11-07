from pyspark.sql import SparkSession
from pyspark.sql.functions import col, unix_timestamp, avg, min, max

spark = (
    SparkSession.builder
    .appName("UMI_Timestamp_Difference_Analysis")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

diff_df = df.withColumn(
    "request_pickup_difference_seconds",
    unix_timestamp("pickup_datetime") - unix_timestamp("request_datetime")
)

print("\n===== REQUEST-PICKUP TIME DIFFERENCE =====")

diff_df.filter(
    col("request_pickup_difference_seconds") < 0
).select(
    avg("request_pickup_difference_seconds").alias("average_seconds"),
    min("request_pickup_difference_seconds").alias("minimum_seconds"),
    max("request_pickup_difference_seconds").alias("maximum_seconds")
).show()

spark.stop()
