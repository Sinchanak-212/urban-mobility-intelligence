
from pyspark.sql import SparkSession
from pyspark.sql.functions import col

spark = (
    SparkSession.builder
    .appName("UMI_Save_Enriched_Data")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

trip_path = (
    "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/"
    "raw/fhvhv_tripdata_2025-01.parquet"
)

zone_path = (
    "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/"
    "reference/taxi_zone_lookup.csv"
)

output_path = (
    "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/"
    "processed/trips_with_zones"
)

# Read source datasets
trips = spark.read.parquet(trip_path)

zones = (
    spark.read
    .option("header", True)
    .option("inferSchema", True)
    .csv(zone_path)
)

# Prepare pickup and drop-off lookup tables
pickup_zones = zones.select(
    col("LocationID").alias("PULocationID"),
    col("Borough").alias("pickup_borough"),
    col("Zone").alias("pickup_zone")
)

dropoff_zones = zones.select(
    col("LocationID").alias("DOLocationID"),
    col("Borough").alias("dropoff_borough"),
    col("Zone").alias("dropoff_zone")
)

# Join trip data with both lookup tables
joined_trips = (
    trips
    .join(pickup_zones, on="PULocationID", how="left")
    .join(dropoff_zones, on="DOLocationID", how="left")
)

# Save enriched data partitioned by pickup borough
(
    joined_trips
    .write
    .mode("overwrite")
    .partitionBy("pickup_borough")
    .parquet(output_path)
)

print("\n===== DATA SAVED SUCCESSFULLY =====")
print("Output:", output_path)

spark.stop()
