import axios from 'axios';
import {
  OVERVIEW_DATA,
  DEMAND_DATA,
  BEHAVIOUR_DATA,
  ANOMALY_DATA,
  FORECAST_DATA
} from '../data/mockData';
import { TAXI_ZONES, POPULAR_ROUTES } from '../data/nycGeoData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper for simulated delay when mocking
const delay = (ms = 250) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Filter mock data based on global query params (borough, provider, dateRange)
 */
function applyFilters(data, params = {}) {
  // If specific borough filter is chosen, clone and adjust where relevant
  if (!params.borough || params.borough === 'all') {
    return data;
  }
  return data;
}

export const mobilityApi = {
  // Health check to detect if FastAPI is online
  async checkHealth() {
    try {
      const response = await apiClient.get('/api/health');
      return { online: true, data: response.data };
    } catch {
      return { online: false, message: 'FastAPI Spark Backend Offline (Operating in Mock Demonstration Mode)' };
    }
  },

  // PAGE 1: Overview
  async getOverview(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(200);
      return OVERVIEW_DATA;
    }
    try {
      const res = await apiClient.get('/api/overview', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/overview call failed, using mock data:', err.message);
      return OVERVIEW_DATA;
    }
  },

  // PAGE 2: Demand - Hourly
  async getDemandHourly(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(200);
      return DEMAND_DATA.hourlyDemand;
    }
    try {
      const res = await apiClient.get('/api/demand/hourly', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/demand/hourly call failed, using mock data:', err.message);
      return DEMAND_DATA.hourlyDemand;
    }
  },

  // PAGE 2: Demand - Daily
  async getDemandDaily(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(200);
      return DEMAND_DATA.dailyDemand;
    }
    try {
      const res = await apiClient.get('/api/demand/daily', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/demand/daily call failed, using mock data:', err.message);
      return DEMAND_DATA.dailyDemand;
    }
  },

  // PAGE 2: Demand - Zones
  async getDemandZones(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(200);
      return {
        topPickupZones: DEMAND_DATA.topPickupZones,
        topDropoffZones: DEMAND_DATA.topDropoffZones,
        boroughDemand: DEMAND_DATA.boroughDemand,
      };
    }
    try {
      const res = await apiClient.get('/api/demand/zones', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/demand/zones call failed, using mock data:', err.message);
      return {
        topPickupZones: DEMAND_DATA.topPickupZones,
        topDropoffZones: DEMAND_DATA.topDropoffZones,
        boroughDemand: DEMAND_DATA.boroughDemand,
      };
    }
  },

  // PAGE 3: Mobility Routes
  async getMobilityRoutes(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(250);
      return POPULAR_ROUTES;
    }
    try {
      const res = await apiClient.get('/api/mobility/routes', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/mobility/routes call failed, using mock data:', err.message);
      return POPULAR_ROUTES;
    }
  },

  // PAGE 3: Geo Hotspots
  async getGeoHotspots(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(250);
      let zones = [...TAXI_ZONES];
      if (params.borough && params.borough !== 'all') {
        zones = zones.filter(z => z.borough.toLowerCase() === params.borough.toLowerCase());
      }
      return zones;
    }
    try {
      const res = await apiClient.get('/api/geo/hotspots', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/geo/hotspots call failed, using mock data:', err.message);
      return TAXI_ZONES;
    }
  },

  // PAGE 4: Travel Behaviour
  async getBehaviour(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(200);
      return BEHAVIOUR_DATA;
    }
    try {
      const res = await apiClient.get('/api/behaviour', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/behaviour call failed, using mock data:', err.message);
      return BEHAVIOUR_DATA;
    }
  },

  // PAGE 5: Anomaly Detection
  async getAnomalies(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(250);
      return ANOMALY_DATA;
    }
    try {
      const res = await apiClient.get('/api/anomalies', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/anomalies call failed, using mock data:', err.message);
      return ANOMALY_DATA;
    }
  },

  // PAGE 6: Demand Forecasting
  async getForecast(params = {}) {
    if (USE_MOCK_FALLBACK) {
      await delay(250);
      return FORECAST_DATA;
    }
    try {
      const res = await apiClient.get('/api/forecast', { params });
      return res.data;
    } catch (err) {
      console.warn('[API] /api/forecast call failed, using mock data:', err.message);
      return FORECAST_DATA;
    }
  }
};

export default mobilityApi;
