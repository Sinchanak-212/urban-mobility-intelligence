from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count

spark = (
    SparkSession.builder
    .appName("UMI_Cross_Borough_Demand")
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

boroughs = [
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island"
]

cross_borough = df.filter(
    col("pickup_borough").isin(boroughs)
    & col("dropoff_borough").isin(boroughs)
    & (col("pickup_borough") != col("dropoff_borough"))
)

result = (
    cross_borough
    .groupBy("pickup_borough", "dropoff_borough")
    .agg(count("*").alias("total_trips"))
    .orderBy(col("total_trips").desc())
)

print("\n===== CROSS-BOROUGH MOBILITY =====")
result.show(25, truncate=False)

print("Total cross-borough trips:", cross_borough.count())

spark.stop()