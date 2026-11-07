from pyspark.sql import SparkSession
from pyspark.sql.functions import col, count, sum, when

spark = (
    SparkSession.builder
    .appName("UMI_Missing_Value_Analysis")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

path = "hdfs://localhost:9000/user/sinchu/urban-mobility-intelligence/raw/fhvhv_tripdata_2025-01.parquet"

df = spark.read.parquet(path)

expressions = [
    count("*").alias("total_records")
]

for column in df.columns:
    expressions.append(
        sum(when(col(column).isNull(), 1).otherwise(0)).alias(column)
    )

print("\n===== MISSING VALUE PROFILE =====")
df.agg(*expressions).show(truncate=False)

spark.stop()
