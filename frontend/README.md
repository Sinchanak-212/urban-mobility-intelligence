# Urban Mobility Intelligence
### Large-Scale Transportation Demand, Travel Behaviour and Spatial Analytics

A modern, high-performance web dashboard for big data analytics of New York City High Volume For-Hire Vehicle (HVFHV) trip records (Uber, Lyft) published by the NYC Taxi and Limousine Commission (TLC).

Developed as the frontend analytics visualization interface for an Apache Spark, Hadoop HDFS, and FastAPI distributed big data processing pipeline.

---

## 🚀 Key Features & Dashboard Modules

The platform features six dedicated analytics modules designed for large-scale transportation intelligence:

1. **Overview Dashboard (`/`)**
   - High-level KPIs: Total Trips (18.5M), Average Distance, Average Duration, Average Passenger Fare, Active TLC Pickup & Drop-off Zones.
   - 30-day daily trip volume and fare fluctuation line/bar composed chart.
   - 12-month historical seasonality bar chart.
   - Top 5 busiest NYC pickup zones with trip shares and fare statistics.
   - PySpark execution insights and HDFS partition summary.

2. **Demand Intelligence (`/demand`)**
   - 24-hour diurnal demand curves with Weekday vs Weekend peak comparisons.
   - Day-of-the-week volume trends (Monday through Sunday).
   - Borough-wise distribution across Manhattan, Brooklyn, Queens, Bronx, and Staten Island.
   - Top 10 pickup and drop-off zones with toggleable ranking tables.
   - Peak hour identification (08:00 AM commuter rush, 06:00 PM outbound evening rush).

3. **Geographic Intelligence (`/geo`)**
   - Interactive GIS map built with **React Leaflet** styled with **CartoDB Dark Matter** tiles.
   - High-density TLC taxi zone pickup & drop-off hotspots with volume-scaled markers.
   - Key Origin-Destination (O-D) arterial transit corridors with telematics routes and congestion indicators.
   - Interactive Zone Inspector displaying centroid coordinates, daily departures, and peak travel times.
   - Layer toggles: All Layers, Pickup Hotspots, Drop-off Hotspots, Popular Routes.

4. **Travel Behaviour (`/behaviour`)**
   - Morning, Afternoon, Evening, and Night mobility period breakdowns.
   - Interactive histograms: Trip Distance distribution, Trip Duration distribution, Passenger Fare distribution.
   - Average trip duration across major commercial and residential hubs.
   - Solo vs Shared/Carpool trip economic comparison.
   - Service Provider breakdown comparing Uber (HV0003) vs Lyft (HV0005) market share, speeds, and driver payouts.

5. **Anomaly Detection (`/anomalies`)**
   - Statistical identification of outliers filtered via PySpark IQR and Isolation Forest.
   - Breakdown of 5 diagnostic classes: Extreme Trip Duration, Spatial/Distance Discrepancy, Abnormal Fare Values, Impossible Speed Combinations, and Zone Demand Surges.
   - Localized demand spike analysis for sports events, arena concerts, and transit outages.
   - Filterable and searchable anomaly audit table with severity flags and Spark diagnostic explanations.

6. **Demand Forecasting (`/forecast`)**
   - Predictive demand curves powered by PySpark MLlib Gradient Boosted Tree (GBDT) regression.
   - Historical vs Predicted demand chart featuring 95% Confidence Interval bands.
   - 24-hour and 7-day forecast horizon switchers.
   - Zone-level demand projection tables with expected growth percentages and confidence scores.
   - Model evaluation metrics: MAE (42.8 trips/hr), RMSE (58.4 trips/hr), MAPE (4.12%), and R² Score (0.942).

---

## 🛠️ Technology Stack

- **Frontend Core**: React 18, Vite
- **Styling & UI**: Tailwind CSS (Dark Navy & Cyan theme, glassy cards, subtle glow effects)
- **Data Visualization**: Recharts (ComposedChart, AreaChart, BarChart, PieChart)
- **Geographic Maps**: Leaflet, React Leaflet, CartoDB Dark Matter Tiles
- **Icons**: Lucide React
- **Routing**: React Router v6
- **HTTP Client**: Axios with configurable REST API service layer
- **Backend Architecture (External)**: Hadoop HDFS, Apache Spark, PySpark, Spark SQL, FastAPI

---

## 📁 Project Architecture

```
frontend/
├── public/
├── src/
│   ├── charts/
│   │   ├── AnomalySpikeChart.jsx
│   │   ├── BoroughComparisonChart.jsx
│   │   ├── DailyTrendChart.jsx
│   │   ├── DistributionChart.jsx
│   │   ├── ForecastComparisonChart.jsx
│   │   └── HourlyDemandChart.jsx
│   ├── components/
│   │   ├── Badge.jsx
│   │   ├── ChartCard.jsx
│   │   ├── ErrorState.jsx
│   │   ├── KPICard.jsx
│   │   ├── Loading.jsx
│   │   ├── Navbar.jsx
│   │   └── Sidebar.jsx
│   ├── context/
│   │   └── AnalyticsContext.jsx
│   ├── data/
│   │   ├── mockData.js
│   │   └── nycGeoData.js
│   ├── layouts/
│   │   └── DashboardLayout.jsx
│   ├── maps/
│   │   └── NYCZoneMap.jsx
│   ├── pages/
│   │   ├── AnomalyDetection.jsx
│   │   ├── DemandForecasting.jsx
│   │   ├── DemandIntelligence.jsx
│   │   ├── GeographicIntelligence.jsx
│   │   ├── Overview.jsx
│   │   └── TravelBehaviour.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
├── .env.example
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 🔌 FastAPI Backend API Integration

The frontend connects via Axios through `src/services/api.js`. The target endpoints correspond directly to the FastAPI backend specifications:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/overview` | GET | Global KPIs, daily/monthly trip counts, top pickup zones |
| `/api/demand/hourly` | GET | 24-hour diurnal demand with weekday/weekend split |
| `/api/demand/daily` | GET | Day-of-week transportation volume |
| `/api/demand/zones` | GET | Top pickup and drop-off zones with borough distribution |
| `/api/mobility/routes` | GET | Top Origin-Destination transit corridors |
| `/api/behaviour` | GET | Distance/duration histograms, ride type comparison, provider shares |
| `/api/anomalies` | GET | Flagged trip records, outlier categories, and demand surges |
| `/api/forecast` | GET | Predicted demand curves, 95% confidence bands, and model metrics |
| `/api/geo/hotspots` | GET | Active TLC taxi zone centroids and daily density metrics |

### Environment Variables

Configure your backend URL in `.env`:

```bash
# FastAPI backend host URL
VITE_API_BASE_URL=http://localhost:8000

# Set to 'false' to route all calls directly to the FastAPI backend
# When 'true' (default), seamless mock fallback data is used for standalone demo
VITE_USE_MOCK_DATA=true
```

---

## 💻 Running the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
```
