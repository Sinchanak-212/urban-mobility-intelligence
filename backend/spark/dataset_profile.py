from pyspark.sql import SparkSession

spark = (
    SparkSession.builder
    .appName("UMI_Dataset_Profile")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

print("Total number of trips:", df.count())

spark.stop()
