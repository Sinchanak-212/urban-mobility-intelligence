import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import mobilityApi from '../services/api';

const AnalyticsContext = createContext();

export const AnalyticsProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState('30d');
  const [borough, setBorough] = useState('all');
  const [provider, setProvider] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ online: false, checked: false });
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  // Check backend health periodically or on mount
  const checkBackend = useCallback(async () => {
    const health = await mobilityApi.checkHealth();
    setBackendStatus({ online: health.online, checked: true, message: health.message });
  }, []);

  useEffect(() => {
    checkBackend();
  }, [checkBackend]);

  const triggerRefresh = useCallback(() => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setLastUpdated(new Date().toLocaleTimeString());
    checkBackend().finally(() => {
      setTimeout(() => setIsRefreshing(false), 600);
    });
  }, [checkBackend]);

  const value = {
    dateRange,
    setDateRange,
    borough,
    setBorough,
    provider,
    setProvider,
    searchQuery,
    setSearchQuery,
    refreshKey,
    triggerRefresh,
    isRefreshing,
    backendStatus,
    lastUpdated,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};
