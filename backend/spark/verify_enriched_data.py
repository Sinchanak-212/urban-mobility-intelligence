
from pyspark.sql import SparkSession

spark = (
    SparkSession.builder
    .appName("UMI_Verify_Enriched_Data")
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

print("\n===== SAVED DATASET VERIFICATION =====")
print("Total records:", df.count())

print("\n===== RECORDS BY PICKUP BOROUGH =====")
df.groupBy("pickup_borough").count().orderBy("pickup_borough").show(
    truncate=False
)

print("\n===== MISSING ZONE MAPPINGS =====")
df.selectExpr(
    "sum(case when pickup_zone is null then 1 else 0 end) as missing_pickup",
    "sum(case when dropoff_zone is null then 1 else 0 end) as missing_dropoff"
).show()

spark.stop()
