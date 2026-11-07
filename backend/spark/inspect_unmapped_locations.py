
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count

spark = (
    SparkSession.builder
    .appName("UMI_Inspect_Unmapped_Locations")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = (
    "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/"
    "processed/trips_with_zones"
)

df = spark.read.parquet(path)

print("\n===== UNMAPPED PICKUP LOCATION IDs =====")

df.filter(col("pickup_borough") == "N/A") \
    .groupBy("PULocationID") \
    .agg(count("*").alias("trip_count")) \
    .orderBy(col("trip_count").desc()) \
    .show(50, truncate=False)

print("\n===== UNMAPPED PICKUP SAMPLE =====")

df.filter(col("pickup_borough") == "N/A") \
    .select(
        "PULocationID",
        "pickup_borough",
        "pickup_zone",
        "DOLocationID",
        "dropoff_borough",
        "dropoff_zone"
    ) \
    .show(10, truncate=False)

spark.stop()
