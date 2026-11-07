from pyspark.sql import SparkSession
from pyspark.sql.functions import col, unix_timestamp, when, count

spark = (
    SparkSession.builder
    .appName("UMI_Timestamp_Difference_Buckets")
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

flagged = df.filter(col("difference_seconds") < 0)

bucketed = flagged.withColumn(
    "difference_category",
    when(col("difference_seconds") >= -60, "Under 1 minute")
    .when(col("difference_seconds") >= -300, "1 to 5 minutes")
    .when(col("difference_seconds") >= -1800, "5 to 30 minutes")
    .otherwise("Over 30 minutes")
)

print("\n===== TIMESTAMP DIFFERENCE DISTRIBUTION =====")

bucketed.groupBy("difference_category").agg(
    count("*").alias("record_count")
).orderBy("record_count", ascending=False).show(truncate=False)

spark.stop()
