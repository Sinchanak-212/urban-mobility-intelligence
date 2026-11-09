import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Polyline,
  Popup,
  Tooltip
} from 'react-leaflet';
import { Layers, Navigation, DollarSign, Clock, MapPin, Eye, Compass } from 'lucide-react';
import { TAXI_ZONES, POPULAR_ROUTES, NYC_CENTER, DEFAULT_MAP_ZOOM } from '../data/nycGeoData';

export const NYCZoneMap = ({
  filterType = 'all', // 'all' | 'pickups' | 'dropoffs' | 'routes'
  selectedBorough = 'all',
  highlightZoneId = null,
  onSelectZone = null
}) => {
  const [activeZone, setActiveZone] = useState(null);
  const [activeRoute, setActiveRoute] = useState(null);

  // Filter zones by borough
  const filteredZones = TAXI_ZONES.filter(z => {
    if (selectedBorough && selectedBorough !== 'all') {
      return z.borough.toLowerCase() === selectedBorough.toLowerCase();
    }
    return true;
  });

  // Calculate circle radius based on metric
  const getRadius = (zone, type) => {
    const value = type === 'dropoffs' ? zone.dailyDropoffs : zone.dailyPickups;
    return Math.max(6, Math.min(24, Math.round(value / 1800)));
  };

  // Color gradient based on volume
  const getColor = (zone, type) => {
    const value = type === 'dropoffs' ? zone.dailyDropoffs : zone.dailyPickups;
    if (value > 30000) return '#06b6d4'; // Cyan 500
    if (value > 20000) return '#3b82f6'; // Blue 500
    if (value > 12000) return '#6366f1'; // Indigo 500
    return '#8b5cf6'; // Violet 500
  };

  const showPickups = filterType === 'all' || filterType === 'pickups';
  const showDropoffs = filterType === 'dropoffs';
  const showRoutes = filterType === 'all' || filterType === 'routes';

  return (
    <div className="relative w-full h-[580px] rounded-xl overflow-hidden border border-slate-800 bg-[#0a0e17]">
      <MapContainer
        center={NYC_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        {/* CartoDB Dark Matter tile layer for premium dark analytics look */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          maxZoom={19}
        />

        {/* Origin-Destination Popular Route Polylines */}
        {showRoutes &&
          POPULAR_ROUTES.map((route) => {
            const isSelected = activeRoute?.id === route.id;
            return (
              <React.Fragment key={route.id}>
                <Polyline
                  positions={route.coordinates}
                  pathOptions={{
                    color: isSelected ? '#38bdf8' : '#0284c7',
                    weight: isSelected ? 4 : 2.5,
                    opacity: isSelected ? 0.95 : 0.65,
                    dashArray: isSelected ? '8, 8' : '4, 6',
                  }}
                  eventHandlers={{
                    click: () => setActiveRoute(route),
                  }}
                >
                  <Popup>
                    <div className="text-xs space-y-1.5 p-1 min-w-[210px]">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                        <span className="font-bold text-cyan-400">High-Volume Corridor</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                          {route.congestionRisk} Congestion
                        </span>
                      </div>
                      <div className="font-semibold text-slate-100 mt-1">
                        {route.fromName} &rarr; {route.toName}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        {route.fromBorough} to {route.toBorough}
                      </div>
                      <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/80 font-mono text-[11px]">
                        <div>
                          <div className="text-slate-500 text-[10px]">Daily Trips</div>
                          <div className="font-semibold text-slate-200">{route.dailyTrips.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">Avg Duration</div>
                          <div className="font-semibold text-slate-200">{route.avgDurationMin} min</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">Distance</div>
                          <div className="font-semibold text-slate-200">{route.avgDistanceMi} mi</div>
                        </div>
                        <div>
                          <div className="text-slate-500 text-[10px]">Avg Fare</div>
                          <div className="font-semibold text-emerald-400">${route.avgFare.toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                  <Tooltip sticky>
                    <div className="text-xs">
                      <strong>{route.fromName} &rarr; {route.toName}</strong>
                      <div>{route.dailyTrips.toLocaleString()} daily trips &bull; {route.avgDurationMin} min</div>
                    </div>
                  </Tooltip>
                </Polyline>
              </React.Fragment>
            );
          })}

        {/* Taxi Zone Hotspots */}
        {(showPickups || showDropoffs) &&
          filteredZones.map((zone) => {
            const isHighlight = highlightZoneId === zone.id || activeZone?.id === zone.id;
            const mode = showDropoffs ? 'dropoffs' : 'pickups';
            const radius = getRadius(zone, mode) + (isHighlight ? 5 : 0);
            const color = getColor(zone, mode);

            return (
              <CircleMarker
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={radius}
                pathOptions={{
                  color: isHighlight ? '#ffffff' : color,
                  weight: isHighlight ? 2.5 : 1.5,
                  fillColor: color,
                  fillOpacity: isHighlight ? 0.85 : 0.6,
                }}
                eventHandlers={{
                  click: () => {
                    setActiveZone(zone);
                    if (onSelectZone) onSelectZone(zone);
                  },
                }}
              >
                <Popup>
                  <div className="text-xs space-y-2 p-1 min-w-[220px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-mono text-[10px] text-cyan-400 font-bold">
                        TLC ZONE #{zone.id}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                        {zone.borough}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{zone.name}</h4>
                      <p className="text-[11px] text-slate-400">{zone.type}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px] font-mono">
                      <div className="p-1.5 rounded bg-slate-900/80">
                        <span className="text-[10px] text-slate-500 block">Daily Pickups</span>
                        <span className="font-semibold text-cyan-300">{zone.dailyPickups.toLocaleString()}</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-900/80">
                        <span className="text-[10px] text-slate-500 block">Daily Dropoffs</span>
                        <span className="font-semibold text-blue-300">{zone.dailyDropoffs.toLocaleString()}</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-900/80">
                        <span className="text-[10px] text-slate-500 block">Avg Fare</span>
                        <span className="font-semibold text-emerald-400">${zone.avgFare.toFixed(2)}</span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-900/80">
                        <span className="text-[10px] text-slate-500 block">Peak Demand</span>
                        <span className="font-semibold text-amber-300">{zone.peakHour}</span>
                      </div>
                    </div>
                  </div>
                </Popup>

                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="text-xs font-sans">
                    <span className="font-bold text-cyan-300">{zone.name}</span> ({zone.borough})
                    <div className="text-[11px] text-slate-300 font-mono">
                      {mode === 'pickups' ? `${zone.dailyPickups.toLocaleString()} Pickups` : `${zone.dailyDropoffs.toLocaleString()} Dropoffs`} &bull; ${zone.avgFare.toFixed(2)} avg
                    </div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {/* Floating Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-slate-300 shadow-xl max-w-xs pointer-events-auto">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>NYC Mobility Density Scale</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#06b6d4] inline-block"></span>
            <span>&gt; 30,000 trips/day (Ultra Dense)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#3b82f6] inline-block"></span>
            <span>20,000 - 30,000 trips/day (High Demand)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#6366f1] inline-block"></span>
            <span>10,000 - 20,000 trips/day (Moderate)</span>
          </div>
          {showRoutes && (
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
              <span className="w-4 h-0.5 bg-sky-400 border-t border-dashed border-sky-300 inline-block"></span>
              <span>Major O-D Travel Corridor</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NYCZoneMap;
