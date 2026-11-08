import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalyticsProvider } from './context/AnalyticsContext';
import DashboardLayout from './layouts/DashboardLayout';

import Overview from './pages/Overview';
import DemandIntelligence from './pages/DemandIntelligence';
import GeographicIntelligence from './pages/GeographicIntelligence';
import TravelBehaviour from './pages/TravelBehaviour';
import AnomalyDetection from './pages/AnomalyDetection';
import DemandForecasting from './pages/DemandForecasting';

export function App() {
  return (
    <AnalyticsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="demand" element={<DemandIntelligence />} />
            <Route path="geo" element={<GeographicIntelligence />} />
            <Route path="behaviour" element={<TravelBehaviour />} />
            <Route path="anomalies" element={<AnomalyDetection />} />
            <Route path="forecast" element={<DemandForecasting />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AnalyticsProvider>
  );
}

export default App;
