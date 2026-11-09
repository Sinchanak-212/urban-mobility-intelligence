import React, { useState } from 'react';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip
} from 'react-leaflet';
import { Layers, MapPin } from 'lucide-react';
import { TAXI_ZONES, NYC_CENTER, DEFAULT_MAP_ZOOM } from '../data/nycGeoData';

export const NYCZoneMap = ({
  filterType = 'all', // 'all' | 'pickups' | 'dropoffs' | 'routes'
  selectedBorough = 'all',
  highlightZoneId = null,
  onSelectZone = null,
  zones = TAXI_ZONES
}) => {
  const [activeZone, setActiveZone] = useState(null);
  const [tilesUnavailable, setTilesUnavailable] = useState(false);

  const filteredZones = (Array.isArray(zones) ? zones : []).filter((zone) =>
    Number.isFinite(zone.lat) &&
    Number.isFinite(zone.lng) &&
    zone.lat >= -90 &&
    zone.lat <= 90 &&
    zone.lng >= -180 &&
    zone.lng <= 180 &&
    zone.name &&
    zone.borough &&
    (!selectedBorough ||
      selectedBorough === 'all' ||
      zone.borough.toLowerCase() === selectedBorough.toLowerCase())
  );
  const showZoneLocations = filterType !== 'routes';

  return (
    <div className="relative w-full h-[580px] rounded-xl overflow-hidden border border-slate-800 bg-[#0a0e17]">
      <MapContainer
        center={NYC_CENTER}
        zoom={DEFAULT_MAP_ZOOM}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          eventHandlers={{
            tileerror: () => setTilesUnavailable(true),
            tileload: () => setTilesUnavailable(false)
          }}
        />

        {showZoneLocations &&
          filteredZones.map((zone) => {
            const isHighlight = highlightZoneId === zone.id || activeZone?.id === zone.id;

            return (
              <CircleMarker
                key={zone.id}
                center={[zone.lat, zone.lng]}
                radius={isHighlight ? 10 : 7}
                pathOptions={{
                  color: isHighlight ? '#ffffff' : '#67e8f9',
                  weight: isHighlight ? 2.5 : 1.5,
                  fillColor: '#06b6d4',
                  fillOpacity: isHighlight ? 0.9 : 0.75,
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
                    </div>
                    <h4 className="font-bold text-sm text-slate-100">{zone.name}</h4>
                    <p className="text-[11px] text-slate-400">{zone.borough}</p>
                  </div>
                </Popup>

                <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                  <div className="text-xs font-sans">
                    <span className="font-bold text-cyan-300">{zone.name}</span>
                    <div className="text-[11px] text-slate-300">{zone.borough} · TLC zone {zone.id}</div>
                  </div>
                </Tooltip>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {tilesUnavailable && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] px-3 py-2 rounded-lg bg-slate-900/95 border border-amber-500/30 text-xs text-amber-200 shadow-xl">
          Basemap unavailable. NYC zone locations remain visible.
        </div>
      )}

      {(!showZoneLocations || filteredZones.length === 0) && (
        <div className="absolute inset-0 z-[900] flex items-center justify-center pointer-events-none">
          <div className="p-4 rounded-xl bg-slate-900/95 border border-slate-700 text-sm text-slate-300 text-center max-w-sm">
            {!showZoneLocations
              ? 'Verified route geometry is not available. Select a zone layer to view TLC locations.'
              : 'Valid TLC zone coordinates are not available for this selection.'}
          </div>
        </div>
      )}

      <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-xs text-slate-300 shadow-xl max-w-xs pointer-events-auto">
        <div className="font-semibold text-slate-200 flex items-center gap-1.5 mb-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>TLC Zone Locations</span>
        </div>
        <div className="space-y-1.5 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#06b6d4] inline-block"></span>
            <span>Zone centroid coordinates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NYCZoneMap;
