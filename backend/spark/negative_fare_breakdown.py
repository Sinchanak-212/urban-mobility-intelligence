from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count

spark = (
    SparkSession.builder
    .appName("UMI_Negative_Fare_Breakdown")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

negative_fares = df.filter(col("base_passenger_fare") < 0)

print("\n===== NEGATIVE FARES BY LICENSE PROVIDER =====")

negative_fares.groupBy("hvfhs_license_num").agg(
    count("*").alias("record_count")
).orderBy("record_count", ascending=False).show()

print("\n===== NEGATIVE FARES BY SHARED REQUEST FLAG =====")

negative_fares.groupBy("shared_request_flag").agg(
    count("*").alias("record_count")
).orderBy("record_count", ascending=False).show()

print("\n===== NEGATIVE FARES BY SHARED MATCH FLAG =====")

negative_fares.groupBy("shared_match_flag").agg(
    count("*").alias("record_count")
).orderBy("record_count", ascending=False).show()

spark.stop()
