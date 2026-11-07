
from pyspark.sql import SparkSession
from pyspark.sql.functions import hour, col, count

spark = (
    SparkSession.builder
    .appName("UMI_Hourly_Demand_Analysis")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = (
    "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/"
    "processed/trips_with_zones"
)

# Read enriched trip data
df = spark.read.parquet(path)

# Extract pickup hour and calculate trip count
hourly_demand = (
    df.withColumn("pickup_hour", hour(col("pickup_datetime")))
    .groupBy("pickup_hour")
    .agg(count("*").alias("total_trips"))
    .orderBy("pickup_hour")
)

print("\n===== HOURLY TRIP DEMAND =====")
hourly_demand.show(24, truncate=False)

print("\n===== PEAK DEMAND HOUR =====")
hourly_demand.orderBy(col("total_trips").desc()).show(1, truncate=False)

spark.stop()
