from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count

spark = (
    SparkSession.builder
    .appName("UMI_Top_Interzone_Routes")
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

interzone_df = df.filter(
    col("PULocationID") != col("DOLocationID")
)

top_routes = (
    interzone_df
    .groupBy(
        "pickup_borough",
        "pickup_zone",
        "dropoff_borough",
        "dropoff_zone"
    )
    .agg(count("*").alias("total_trips"))
    .orderBy(col("total_trips").desc())
    .limit(15)
)

print("\n===== TOP 15 INTER-ZONE ROUTES =====")
top_routes.show(15, truncate=False)

spark.stop()