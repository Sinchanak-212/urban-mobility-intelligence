from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count

spark = (
    SparkSession.builder
    .appName("UMI_Top_Pickup_Zones")
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

top_zones = (
    df.groupBy("pickup_borough", "pickup_zone")
    .agg(count("*").alias("total_pickups"))
    .orderBy(col("total_pickups").desc())
    .limit(15)
)

print("\n===== TOP 15 PICKUP ZONES =====")
top_zones.show(15, truncate=False)

spark.stop()