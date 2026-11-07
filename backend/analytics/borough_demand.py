
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, round

spark = (
    SparkSession.builder
    .appName("UMI_Borough_Demand_Analysis")
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

# Count trips originating in each pickup borough
borough_demand = (
    df.groupBy("pickup_borough")
    .agg(count("*").alias("total_trips"))
    .withColumn(
        "percentage",
        round(
            col("total_trips") * 100 / df.count(),
            2
        )
    )
    .orderBy(col("total_trips").desc())
)

print("\n===== PICKUP DEMAND BY BOROUGH =====")
borough_demand.show(truncate=False)

spark.stop()
