import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  Filter,
  DollarSign,
  Clock,
  Compass,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';
import NYCZoneMap from '../maps/NYCZoneMap';
import ChartCard from '../components/ChartCard';
import KPICard from '../components/KPICard';
import Badge from '../components/Badge';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import mobilityApi from '../services/api';
import { useAnalytics } from '../context/AnalyticsContext';
import { POPULAR_ROUTES, TAXI_ZONES } from '../data/nycGeoData';

export const GeographicIntelligence = () => {
  const { borough, refreshKey } = useAnalytics();
  const [mapFilter, setMapFilter] = useState('all'); // 'all' | 'pickups' | 'dropoffs' | 'routes'
  const [selectedZone, setSelectedZone] = useState(null);
  const [zones, setZones] = useState(TAXI_ZONES);
  const [routes, setRoutes] = useState(POPULAR_ROUTES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    Promise.all([
      mobilityApi.getGeoHotspots({ borough }),
      mobilityApi.getMobilityRoutes({ borough })
    ])
      .then(([zonesRes, routesRes]) => {
        if (isMounted) {
          setZones(zonesRes);
          setRoutes(routesRes);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          console.warn('Geo data fetch fallback:', err.message);
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [borough, refreshKey]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Geographic Intelligence
            </h1>
            <Badge variant="emerald" size="sm">
              Spatial Analytics & Corridors
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Interactive geospatial mapping of NYC TLC taxi zones, high-density pickup & drop-off hotspots, and key origin-destination travel arteries.
          </p>
        </div>

        {/* Map Layers & Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex rounded-lg bg-slate-900 border border-slate-800 p-1 text-xs">
            <button
              onClick={() => setMapFilter('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                mapFilter === 'all'
                  ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Layers
            </button>
            <button
              onClick={() => setMapFilter('pickups')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                mapFilter === 'pickups'
                  ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pickup Hotspots
            </button>
            <button
              onClick={() => setMapFilter('dropoffs')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                mapFilter === 'dropoffs'
                  ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Drop-off Hotspots
            </button>
            <button
              onClick={() => setMapFilter('routes')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                mapFilter === 'routes'
                  ? 'bg-cyan-500 text-slate-900 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Popular Routes
            </button>
          </div>
        </div>
      </div>

      {/* Map Stats Quick Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="TLC Zone Locations"
          value={zones.length}
          unit="centroids"
          subtitle="Coordinate records available"
          icon={MapPin}
          accentColor="cyan"
          tooltip="TLC zone centroid coordinates available for display on the map"
        />
        <KPICard
          title="Zone Boundaries"
          value="Not available"
          unit="Centroids only"
          subtitle="Polygon geometry not loaded"
          icon={Compass}
          accentColor="blue"
          tooltip="Only zone centroid coordinates are available in the frontend geographic reference"
        />
        <KPICard
          title="Zone Demand Values"
          value="Not available"
          unit="Not provided"
          subtitle="No zone-level metrics loaded"
          icon={Navigation}
          accentColor="indigo"
          tooltip="The map has no verified zone-level demand statistics"
        />
        <KPICard
          title="Route Geometry"
          value="Not available"
          unit="Not provided"
          subtitle="No verified route paths loaded"
          icon={Activity}
          accentColor="emerald"
          tooltip="The map does not have verified route geometries to display"
        />
      </div>

      {/* Main Interactive Map Component */}
      <div className="rounded-xl overflow-hidden border border-slate-800 shadow-2xl relative">
        <div className="bg-[#0f172a] px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">NYC TLC Zone Locations</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Click a zone centroid to inspect its location</span>
          </div>
          <div className="text-[11px] font-mono text-cyan-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            OpenStreetMap tile layer
          </div>
        </div>

        {/* Leaflet Map */}
        <NYCZoneMap
          filterType={mapFilter}
          selectedBorough={borough}
          highlightZoneId={selectedZone?.id}
          onSelectZone={(zone) => setSelectedZone(zone)}
          zones={zones}
        />
      </div>

      {/* Corridor Breakdown & Zone Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Popular Origin-Destination Routes Table */}
        <div className="lg:col-span-8">
          <ChartCard
            title="Popular Origin-Destination Corridors"
            subtitle="Extracted via Spark SQL grouping of (PULocationID, DOLocationID) pairs"
            icon={Navigation}
            badge={<Badge variant="primary" size="xs">Top Arteries</Badge>}
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase text-[11px]">
                    <th className="py-3 px-3">Route Corridors</th>
                    <th className="py-3 px-3">Borough Connection</th>
                    <th className="py-3 px-3 text-right">Daily Trips</th>
                    <th className="py-3 px-3 text-right">Avg Duration</th>
                    <th className="py-3 px-3 text-right">Distance</th>
                    <th className="py-3 px-3 text-right">Avg Fare</th>
                    <th className="py-3 px-3 text-center">Risk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {routes.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-sans font-bold text-slate-200">
                        {r.fromName} &rarr; {r.toName}
                      </td>
                      <td className="py-3 px-3 font-sans text-slate-400">
                        {r.fromBorough} &rarr; {r.toBorough}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-100 font-bold">{r.dailyTrips.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-cyan-300">{r.avgDurationMin} min</td>
                      <td className="py-3 px-3 text-right text-slate-300">{r.avgDistanceMi} mi</td>
                      <td className="py-3 px-3 text-right text-emerald-400 font-bold">${r.avgFare.toFixed(2)}</td>
                      <td className="py-3 px-3 text-center">
                        <Badge variant={r.congestionRisk === 'High' ? 'rose' : 'primary'} size="xs">
                          {r.congestionRisk}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>

        {/* Selected Zone Inspector Panel */}
        <div className="lg:col-span-4">
          <ChartCard
            title="TLC Zone Location"
            subtitle={selectedZone ? `TLC Zone #${selectedZone.id}` : 'Select a zone on the map'}
            icon={MapPin}
            badge={<Badge variant="indigo" size="xs">Centroid</Badge>}
          >
            {selectedZone ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-cyan-400">ID: #{selectedZone.id}</span>
                    <Badge variant="blue" size="xs">{selectedZone.borough}</Badge>
                  </div>
                  <h4 className="text-base font-bold text-white mt-1">{selectedZone.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedZone.type}</p>

                  <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between font-mono">
                    <span>Lat: {Number(selectedZone.lat).toFixed(4)}</span>
                    <span>Lng: {Number(selectedZone.lng).toFixed(4)}</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs text-slate-300">
                  <div className="font-semibold text-cyan-400 mb-1 flex items-center gap-1.5">
                    <Navigation className="w-3.5 h-3.5" />
                    Spatial Clustering Context
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Centroid locations are available; official zone polygon boundaries are not loaded.
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 rounded-xl bg-slate-900/40 border border-dashed border-slate-800">
                <MapPin className="w-8 h-8 text-slate-600 mb-2" />
                <h4 className="text-xs font-semibold text-slate-300">No Zone Selected</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Click a TLC zone centroid on the map to inspect its location.
                </p>
              </div>
            )}
          </ChartCard>
        </div>
      </div>
    </div>
  );
};

export default GeographicIntelligence;
