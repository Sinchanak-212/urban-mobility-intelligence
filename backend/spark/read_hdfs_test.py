from pyspark.sql import SparkSession

spark = (
    SparkSession.builder
    .appName("UMI_HDFS_Parquet_Test")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

print("\n===== DATASET SCHEMA =====")
df.printSchema()

print("\n===== FIRST 5 RECORDS =====")
df.show(5, truncate=False)

print("\nSpark version:", spark.version)

spark.stop()
