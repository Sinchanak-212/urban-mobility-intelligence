
import builtins
import json
from pathlib import Path
from datetime import datetime, timezone

from pyspark.sql import SparkSession
from pyspark.sql.functions import (
    col, count, avg, min, max, round, hour,
    dayofweek, date_format, when, to_date,
    countDistinct, percentile_approx
)

# --------------------------------------------------
# CONFIGURATION
# --------------------------------------------------

HDFS_BASE = (
    "hdfs://localhost:9000/user/sinchu/"
    "urban-mobility-intelligence"
)

TRIPS_PATH = f"{HDFS_BASE}/processed/trips_with_zones"
ANOMALY_PATH = f"{HDFS_BASE}/analytics/anomaly_detection"

OUTPUT_DIR = Path("data/outputs/analytics")

BOROUGHS = [
    "Manhattan",
    "Brooklyn",
    "Queens",
    "Bronx",
    "Staten Island"
]

# --------------------------------------------------
# SPARK SESSION
# --------------------------------------------------

spark = (
    SparkSession.builder
    .appName("UMI_Dashboard_Analytics_Export")
    .master("local[2]")
    .config("spark.driver.memory", "2g")
    .config("spark.hadoop.fs.defaultFS", "hdfs://localhost:9000")
    .getOrCreate()
)

spark.sparkContext.setLogLevel("WARN")

# --------------------------------------------------
# HELPER FUNCTIONS
# --------------------------------------------------

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def save_json(filename, data):
    """Save aggregated analytics as formatted JSON."""

    output_path = OUTPUT_DIR / filename

    with open(output_path, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4, allow_nan=False)

    print(f"Saved: {output_path}")


def collect_records(dataframe):
    """Collect a small aggregated DataFrame as JSON records."""

    return [
        json.loads(record)
        for record in dataframe.toJSON().collect()
    ]


# --------------------------------------------------
# READ ENRICHED DATA
# --------------------------------------------------

print("\nReading enriched trip data from HDFS...")

df = spark.read.parquet(TRIPS_PATH)

total_trips = df.count()

print(f"Total trips: {total_trips:,}")

# --------------------------------------------------
# 1. OVERVIEW
# --------------------------------------------------

overview = {
    "total_trips": total_trips,
    "dataset": "NYC TLC HVFHV",
    "period": "January 2025",
    "generated_at": datetime.now(timezone.utc).isoformat()
}

save_json("overview.json", overview)

# --------------------------------------------------
# 2. HOURLY DEMAND
# --------------------------------------------------

hourly = (
    df.withColumn("pickup_hour", hour("pickup_datetime"))
    .groupBy("pickup_hour")
    .agg(count("*").alias("total_trips"))
    .orderBy("pickup_hour")
)

save_json("hourly_demand.json", collect_records(hourly))

# --------------------------------------------------
# 3. DAILY DEMAND BY WEEKDAY
# --------------------------------------------------

daily = (
    df.withColumn("day_number", dayofweek("pickup_datetime"))
    .withColumn("day_name", date_format("pickup_datetime", "EEEE"))
    .groupBy("day_number", "day_name")
    .agg(count("*").alias("total_trips"))
    .orderBy("day_number")
)

save_json("daily_demand.json", collect_records(daily))

# --------------------------------------------------
# 4. BOROUGH DEMAND
# --------------------------------------------------

borough = (
    df.groupBy("pickup_borough")
    .agg(count("*").alias("total_trips"))
    .withColumn(
        "percentage",
        round(col("total_trips") * 100 / total_trips, 2)
    )
    .orderBy(col("total_trips").desc())
)

save_json("borough_demand.json", collect_records(borough))

# --------------------------------------------------
# 5. TOP 15 PICKUP ZONES
# --------------------------------------------------

top_zones = (
    df.groupBy("pickup_borough", "pickup_zone")
    .agg(count("*").alias("total_pickups"))
    .orderBy(col("total_pickups").desc())
    .limit(15)
)

save_json("top_pickup_zones.json", collect_records(top_zones))

# --------------------------------------------------
# 6. TOP 15 ROUTES
# --------------------------------------------------

route_columns = [
    "pickup_borough",
    "pickup_zone",
    "dropoff_borough",
    "dropoff_zone"
]

top_routes = (
    df.groupBy(*route_columns)
    .agg(count("*").alias("total_trips"))
    .orderBy(col("total_trips").desc())
    .limit(15)
)

save_json("top_routes.json", collect_records(top_routes))

# --------------------------------------------------
# 7. TOP 15 INTER-ZONE ROUTES
# --------------------------------------------------

interzone = df.filter(
    col("PULocationID") != col("DOLocationID")
)

top_interzone = (
    interzone.groupBy(*route_columns)
    .agg(count("*").alias("total_trips"))
    .orderBy(col("total_trips").desc())
    .limit(15)
)

save_json(
    "top_interzone_routes.json",
    collect_records(top_interzone)
)

# --------------------------------------------------
# 8. OVERALL TRAVEL BEHAVIOUR
# --------------------------------------------------

valid_trips = df.filter(
    (col("trip_miles") > 0)
    & (col("trip_time") > 0)
)

travel_summary = valid_trips.agg(
    count("*").alias("valid_trips"),
    round(avg("trip_miles"), 2).alias("average_distance_miles"),
    round(avg("trip_time") / 60, 2).alias("average_duration_minutes"),
    round(
        percentile_approx("trip_miles", 0.5), 2
    ).alias("median_distance_miles"),
    round(
        percentile_approx("trip_time", 0.5) / 60, 2
    ).alias("median_duration_minutes"),
    round(min("trip_miles"), 2).alias("minimum_distance"),
    round(max("trip_miles"), 2).alias("maximum_distance")
)

save_json(
    "travel_behavior.json",
    collect_records(travel_summary)
)

# --------------------------------------------------
# 9. TRAVEL BEHAVIOUR BY BOROUGH
# --------------------------------------------------

borough_travel = (
    valid_trips
    .filter(col("pickup_borough").isin(BOROUGHS))
    .groupBy("pickup_borough")
    .agg(
        count("*").alias("total_trips"),
        round(avg("trip_miles"), 2).alias("avg_distance_miles"),
        round(
            avg("trip_time") / 60, 2
        ).alias("avg_duration_minutes")
    )
    .orderBy(col("avg_duration_minutes").desc())
)

save_json(
    "travel_by_borough.json",
    collect_records(borough_travel)
)

# --------------------------------------------------
# 10. CROSS-BOROUGH MOBILITY
# --------------------------------------------------

cross_borough = df.filter(
    col("pickup_borough").isin(BOROUGHS)
    & col("dropoff_borough").isin(BOROUGHS)
    & (col("pickup_borough") != col("dropoff_borough"))
)

cross_borough_result = (
    cross_borough
    .groupBy("pickup_borough", "dropoff_borough")
    .agg(count("*").alias("total_trips"))
    .orderBy(col("total_trips").desc())
)

cross_records = collect_records(cross_borough_result)

cross_summary = {
    "total_cross_borough_trips": sum(
        record["total_trips"] for record in cross_records
    ),
    "flows": cross_records
}

save_json("cross_borough_demand.json", cross_summary)

# --------------------------------------------------
# 11. TRAVEL DURATION BY HOUR
# --------------------------------------------------

duration_hourly = (
    valid_trips
    .withColumn("pickup_hour", hour("pickup_datetime"))
    .groupBy("pickup_hour")
    .agg(
        count("*").alias("total_trips"),
        round(
            avg("trip_time") / 60, 2
        ).alias("avg_duration_minutes"),
        round(
            avg("trip_miles"), 2
        ).alias("avg_distance_miles")
    )
    .orderBy("pickup_hour")
)

save_json(
    "duration_by_hour.json",
    collect_records(duration_hourly)
)

# --------------------------------------------------
# 12. WEEKDAY VS WEEKEND
# --------------------------------------------------

classified = (
    df.withColumn("day_number", dayofweek("pickup_datetime"))
    .withColumn(
        "day_type",
        when(col("day_number").isin(1, 7), "Weekend")
        .otherwise("Weekday")
    )
    .withColumn("pickup_date", to_date("pickup_datetime"))
)

weekday_weekend = (
    classified
    .groupBy("day_type")
    .agg(
        count("*").alias("total_trips"),
        countDistinct("pickup_date").alias("number_of_days")
    )
    .withColumn(
        "average_trips_per_day",
        round(col("total_trips") / col("number_of_days"), 0)
    )
    .orderBy("day_type")
)

save_json(
    "weekday_weekend.json",
    collect_records(weekday_weekend)
)

# --------------------------------------------------
# 13. ANOMALY SUMMARY
# --------------------------------------------------

print("\nReading anomaly detection results from HDFS...")

anomaly_df = spark.read.parquet(ANOMALY_PATH)

anomaly_total = anomaly_df.filter(
    col("is_anomaly") == 1
).count()

reason_columns = [
    ("invalid_distance", "Invalid distance"),
    ("invalid_duration", "Invalid duration"),
    ("negative_fare", "Negative fare"),
    ("request_after_pickup", "Request after pickup"),
    ("dropoff_before_pickup", "Dropoff before pickup")
]

reason_counts = {}

for column_name, display_name in reason_columns:
    reason_counts[display_name] = anomaly_df.filter(
        col(column_name) == 1
    ).count()

anomaly_summary = {
    "total_trips": total_trips,
    "unique_anomaly_records": anomaly_total,
    "anomaly_percentage": builtins.round(
        anomaly_total * 100 / total_trips, 2
    ),
    "reason_counts": reason_counts
}

save_json("anomaly_summary.json", anomaly_summary)

# --------------------------------------------------
# FINISH
# --------------------------------------------------

print("\n========================================")
print("DASHBOARD ANALYTICS EXPORT COMPLETED")
print("========================================")
print(f"Output directory: {OUTPUT_DIR.resolve()}")
print("Total JSON files: 13")

spark.stop()
