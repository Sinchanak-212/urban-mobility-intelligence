import json
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Urban Mobility Intelligence API",
    description="Hadoop and Apache Spark-based urban mobility analytics",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Locate the project root and analytics output directory
PROJECT_ROOT = Path(__file__).resolve().parents[2]
ANALYTICS_DIR = PROJECT_ROOT / "data" / "outputs" / "analytics"


def load_analytics(filename: str):
    file_path = ANALYTICS_DIR / filename

    if not file_path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"Analytics file not found: {filename}"
        )

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            return json.load(file)
    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail=f"Invalid JSON file: {filename}"
        )


@app.get("/")
def root():
    return {"message": "Urban Mobility Intelligence API is running"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.get("/api/overview")
def overview():
    return load_analytics("overview.json")


@app.get("/api/demand/hourly")
def hourly_demand():
    return load_analytics("hourly_demand.json")


@app.get("/api/demand/daily")
def daily_demand():
    return load_analytics("daily_demand.json")


@app.get("/api/demand/boroughs")
def borough_demand():
    return load_analytics("borough_demand.json")


@app.get("/api/demand/top-zones")
def top_pickup_zones():
    return load_analytics("top_pickup_zones.json")


@app.get("/api/mobility/top-routes")
def top_routes():
    return load_analytics("top_routes.json")


@app.get("/api/mobility/interzone-routes")
def interzone_routes():
    return load_analytics("top_interzone_routes.json")


@app.get("/api/behaviour/summary")
def travel_behavior():
    return load_analytics("travel_behavior.json")


@app.get("/api/behaviour/by-borough")
def travel_by_borough():
    return load_analytics("travel_by_borough.json")


@app.get("/api/behaviour/duration-by-hour")
def duration_by_hour():
    return load_analytics("duration_by_hour.json")


@app.get("/api/demand/cross-borough")
def cross_borough_demand():
    return load_analytics("cross_borough_demand.json")


@app.get("/api/demand/weekday-weekend")
def weekday_weekend():
    return load_analytics("weekday_weekend.json")


@app.get("/api/anomalies/summary")
def anomaly_summary():
    return load_analytics("anomaly_summary.json")