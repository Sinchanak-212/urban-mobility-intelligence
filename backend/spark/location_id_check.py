from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count

spark = (
    SparkSession.builder
    .appName("UMI_Location_ID_Check")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

print("\n===== PICKUP LOCATION ID CHECK =====")

df.filter(
    col("PULocationID").isNull() |
    (col("PULocationID") <= 0) |
    (col("PULocationID") > 265)
).agg(count("*").alias("invalid_pickup_locations")).show()

print("\n===== DROPOFF LOCATION ID CHECK =====")

df.filter(
    col("DOLocationID").isNull() |
    (col("DOLocationID") <= 0) |
    (col("DOLocationID") > 265)
).agg(count("*").alias("invalid_dropoff_locations")).show()

spark.stop()
