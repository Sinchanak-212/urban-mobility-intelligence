
from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, dayofweek, date_format, count
)

spark = (
    SparkSession.builder
    .appName("UMI_Daily_Demand_Analysis")
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

# Extract day of week and calculate trip counts
daily_demand = (
    df.withColumn("day_number", dayofweek(col("pickup_datetime")))
    .withColumn("day_name", date_format(col("pickup_datetime"), "EEEE"))
    .groupBy("day_number", "day_name")
    .agg(count("*").alias("total_trips"))
    .orderBy("day_number")
)

print("\n===== TRIPS BY DAY OF WEEK =====")
daily_demand.show(7, truncate=False)

print("\n===== HIGHEST DEMAND DAY =====")
daily_demand.orderBy(
    col("total_trips").desc()
).show(1, truncate=False)

print("\n===== LOWEST DEMAND DAY =====")
daily_demand.orderBy(
    col("total_trips").asc()
).show(1, truncate=False)

spark.stop()
