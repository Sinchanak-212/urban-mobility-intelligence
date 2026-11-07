from pyspark.sql import SparkSession

spark = (
    SparkSession.builder
    .appName("UMI_Zone_Lookup_Test")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/reference/taxi_zone_lookup.csv"

zones = (
    spark.read
    .option("header", True)
    .option("inferSchema", True)
    .csv(path)
)

print("\n===== ZONE LOOKUP SCHEMA =====")
zones.printSchema()

print("\n===== FIRST 10 ZONES =====")
zones.show(10, truncate=False)

print("\n===== TOTAL ZONES =====")
print(zones.count())

spark.stop()