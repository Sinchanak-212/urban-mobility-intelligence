import axios from 'axios';
import {
  OVERVIEW_DATA,
  DEMAND_DATA,
  ANOMALY_DATA,
} from '../data/mockData';
import { TAXI_ZONES, POPULAR_ROUTES } from '../data/nycGeoData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const USE_MOCK_FALLBACK = import.meta.env.VITE_USE_MOCK_DATA === 'true';

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
      const response = await apiClient.get('/health');
      return { online: true, data: response.data };
    } catch {
      return { online: false, message: 'FastAPI Spark Backend Offline (Operating in Mock Demonstration Mode)' };
    }
  },

  // PAGE 1: Overview
  async getOverview(params = {}) {
  const res = await apiClient.get('/api/overview', { params });
  return res.data;
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
  const res = await apiClient.get('/api/demand/daily', { params });
  return res.data;
},

  async getHistoricalDemand() {
    const [hourlyRes, dailyRes, boroughRes] = await Promise.all([
      apiClient.get('/api/demand/hourly'),
      apiClient.get('/api/demand/daily'),
      apiClient.get('/api/demand/boroughs')
    ]);

    return {
      hourlyDemand: hourlyRes.data,
      dailyDemand: dailyRes.data,
      boroughDemand: boroughRes.data
    };
  },

  // PAGE 2: Demand - Zones
  async getDemandZones(params = {}) {
  const [zonesRes, boroughsRes] = await Promise.all([
    apiClient.get('/api/demand/top-zones', { params }),
    apiClient.get('/api/demand/boroughs', { params }),
  ]);

  return {
    topPickupZones: zonesRes.data,
    boroughDemand: boroughsRes.data,
    topDropoffZones: [],
  };
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
    return TAXI_ZONES
      .filter((zone) =>
        (!params.borough || params.borough === 'all' ||
          zone.borough.toLowerCase() === params.borough.toLowerCase()) &&
        Number.isFinite(zone.lat) &&
        Number.isFinite(zone.lng) &&
        zone.lat >= -90 &&
        zone.lat <= 90 &&
        zone.lng >= -180 &&
        zone.lng <= 180
      )
      .map(({ id, name, borough, lat, lng, type }) => ({
        id,
        name,
        borough,
        lat,
        lng,
        type
      }));
  },

  // PAGE 4: Travel Behaviour
  async getBehaviour(params = {}) {
    const res = await apiClient.get('/api/behaviour/summary', { params });
    return Array.isArray(res.data) ? res.data[0] ?? null : res.data;
  },

  async getBehaviourByBorough(params = {}) {
    const res = await apiClient.get('/api/behaviour/by-borough', { params });
    return res.data;
  },

  async getBehaviourByHour(params = {}) {
    const res = await apiClient.get('/api/behaviour/duration-by-hour', { params });
    return res.data;
  },

  async getWeekdayWeekend(params = {}) {
    const res = await apiClient.get('/api/demand/weekday-weekend', { params });
    return res.data;
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

};

export default mobilityApi;
