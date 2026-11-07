
from pyspark.sql import SparkSession
from pyspark.sql.functions import col

spark = (
    SparkSession.builder
    .appName("UMI_Trip_Zone_Join")
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

# Read trip records and zone reference data
trips = spark.read.parquet(trip_path)

zones = (
    spark.read
    .option("header", True)
    .option("inferSchema", True)
    .csv(zone_path)
)

# Create separate pickup and drop-off lookup tables
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

# Join both lookup tables with trip records
joined_trips = (
    trips
    .join(pickup_zones, on="PULocationID", how="left")
    .join(dropoff_zones, on="DOLocationID", how="left")
)

print("\n===== JOINED DATASET SCHEMA =====")
joined_trips.printSchema()

print("\n===== SAMPLE JOINED RECORDS =====")
joined_trips.select(
    "PULocationID",
    "pickup_borough",
    "pickup_zone",
    "DOLocationID",
    "dropoff_borough",
    "dropoff_zone"
).show(10, truncate=False)

print("\n===== TOTAL JOINED RECORDS =====")
print(joined_trips.count())

print("\n===== MISSING PICKUP ZONE MAPPINGS =====")
print(
    joined_trips.filter(col("pickup_zone").isNull()).count()
)

print("\n===== MISSING DROPOFF ZONE MAPPINGS =====")
print(
    joined_trips.filter(col("dropoff_zone").isNull()).count()
)

spark.stop()
