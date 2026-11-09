// Realistic Big Data Analytics Mock Datasets
// Based on NYC TLC High Volume For-Hire Vehicle (HVFHV) Trip Records
// NOTE: These datasets represent baseline demonstration outputs processed by PySpark / Spark SQL.

export const OVERVIEW_DATA = {
  kpis: {
    totalTrips: 18492840,
    totalTripsDisplay: '18,492,840',
    avgDistance: 4.82,
    avgDuration: 21.4,
    avgFare: 26.85,
    totalPickupLocations: 263,
    totalDropoffLocations: 261,
    avgDriverPay: 19.42,
    sharedRidePct: 2.14,
    sparkExecutionTimeSec: 84.6,
    activeExecutors: 16
  },
  kpiTrends: {
    trips: '+5.4% vs last month',
    distance: '-0.8% vs last month',
    duration: '+1.2% vs last month',
    fare: '+3.1% vs last month'
  },
  dailyTrips: [
    { date: 'Oct 01', trips: 592400, avgFare: 25.80, avgDistance: 4.75 },
    { date: 'Oct 02', trips: 604100, avgFare: 26.10, avgDistance: 4.80 },
    { date: 'Oct 03', trips: 618500, avgFare: 26.40, avgDistance: 4.82 },
    { date: 'Oct 04', trips: 645200, avgFare: 27.20, avgDistance: 4.90 },
    { date: 'Oct 05', trips: 712800, avgFare: 28.50, avgDistance: 5.10 }, // Friday
    { date: 'Oct 06', trips: 748900, avgFare: 29.10, avgDistance: 5.15 }, // Saturday
    { date: 'Oct 07', trips: 631200, avgFare: 27.40, avgDistance: 4.95 }, // Sunday
    { date: 'Oct 08', trips: 588300, avgFare: 25.90, avgDistance: 4.70 },
    { date: 'Oct 09', trips: 599400, avgFare: 26.00, avgDistance: 4.78 },
    { date: 'Oct 10', trips: 615700, avgFare: 26.35, avgDistance: 4.81 },
    { date: 'Oct 11', trips: 638900, avgFare: 26.90, avgDistance: 4.86 },
    { date: 'Oct 12', trips: 724100, avgFare: 28.70, avgDistance: 5.12 },
    { date: 'Oct 13', trips: 762300, avgFare: 29.40, avgDistance: 5.20 },
    { date: 'Oct 14', trips: 642800, avgFare: 27.60, avgDistance: 4.98 },
    { date: 'Oct 15', trips: 595100, avgFare: 25.85, avgDistance: 4.72 },
    { date: 'Oct 16', trips: 608400, avgFare: 26.15, avgDistance: 4.79 },
    { date: 'Oct 17', trips: 622900, avgFare: 26.50, avgDistance: 4.83 },
    { date: 'Oct 18', trips: 651000, avgFare: 27.10, avgDistance: 4.88 },
    { date: 'Oct 19', trips: 735600, avgFare: 28.90, avgDistance: 5.14 },
    { date: 'Oct 20', trips: 778400, avgFare: 29.80, avgDistance: 5.22 },
    { date: 'Oct 21', trips: 654200, avgFare: 27.80, avgDistance: 5.01 },
    { date: 'Oct 22', trips: 601300, avgFare: 26.00, avgDistance: 4.75 },
    { date: 'Oct 23', trips: 614700, avgFare: 26.25, avgDistance: 4.80 },
    { date: 'Oct 24', trips: 629800, avgFare: 26.60, avgDistance: 4.84 },
    { date: 'Oct 25', trips: 659400, avgFare: 27.30, avgDistance: 4.90 },
    { date: 'Oct 26', trips: 749100, avgFare: 29.20, avgDistance: 5.16 },
    { date: 'Oct 27', trips: 792500, avgFare: 30.10, avgDistance: 5.25 },
    { date: 'Oct 28', trips: 668900, avgFare: 27.95, avgDistance: 5.02 },
    { date: 'Oct 29', trips: 607800, avgFare: 26.10, avgDistance: 4.76 },
    { date: 'Oct 30', trips: 624500, avgFare: 26.45, avgDistance: 4.82 },
  ],
  monthlyTrends: [
    { month: 'Jan', trips: 15.8, avgFare: 25.10, growth: '+2.1%' },
    { month: 'Feb', trips: 15.2, avgFare: 25.40, growth: '-3.8%' },
    { month: 'Mar', trips: 17.1, avgFare: 25.90, growth: '+12.5%' },
    { month: 'Apr', trips: 17.6, avgFare: 26.20, growth: '+2.9%' },
    { month: 'May', trips: 18.2, avgFare: 26.50, growth: '+3.4%' },
    { month: 'Jun', trips: 18.0, avgFare: 26.80, growth: '-1.1%' },
    { month: 'Jul', trips: 17.5, avgFare: 26.60, growth: '-2.8%' },
    { month: 'Aug', trips: 17.2, avgFare: 26.40, growth: '-1.7%' },
    { month: 'Sep', trips: 18.1, avgFare: 26.70, growth: '+5.2%' },
    { month: 'Oct', trips: 18.5, avgFare: 26.85, growth: '+2.2%' },
    { month: 'Nov', trips: 18.8, avgFare: 27.10, growth: '+1.6%' },
    { month: 'Dec', trips: 19.4, avgFare: 28.20, growth: '+3.2%' },
  ],
  topFivePickupZones: [
    { rank: 1, id: 132, name: 'JFK Airport', borough: 'Queens', trips: '1,026,000', share: '5.55%', avgFare: '$68.50', trend: '+4.2%' },
    { rank: 2, id: 230, name: 'Times Sq / Theater District', borough: 'Manhattan', trips: '942,000', share: '5.09%', avgFare: '$24.30', trend: '+1.8%' },
    { rank: 3, id: 161, name: 'Midtown Center', borough: 'Manhattan', trips: '894,000', share: '4.83%', avgFare: '$25.90', trend: '+2.5%' },
    { rank: 4, id: 237, name: 'Upper East Side South', borough: 'Manhattan', trips: '858,000', share: '4.64%', avgFare: '$22.40', trend: '-0.4%' },
    { rank: 5, id: 138, name: 'LaGuardia Airport', borough: 'Queens', trips: '804,000', share: '4.35%', avgFare: '$44.20', trend: '+3.7%' },
  ],
  insights: [
    {
      id: 1,
      type: 'peak',
      title: 'Evening Rush Dominance',
      description: 'Peak transportation demand consistently surges between 17:30 and 19:45 EDT, driven by Manhattan commercial outflux to Brooklyn and Queens.',
      badge: 'Demand Spike'
    },
    {
      id: 2,
      type: 'airport',
      title: 'Airport Travel Premium',
      description: 'JFK and LaGuardia airport corridors generate 18.2% of total passenger revenue despite accounting for only 9.9% of overall trip count.',
      badge: 'High Revenue'
    },
    {
      id: 3,
      type: 'spark',
      title: 'HDFS Partition Efficiency',
      description: 'PySpark distributed job aggregated 18.5M parquet records in 84.6 seconds using 16 cluster workers with zero data skew degradation.',
      badge: 'Spark Cluster'
    },
    {
      id: 4,
      type: 'behaviour',
      title: 'Solo Ride Consolidation',
      description: 'Non-shared rides constitute 97.86% of all HVFHV volume. High-volume ridesharing carpools remain depressed across post-pandemic Manhattan.',
      badge: 'Behavioral Trend'
    }
  ]
};

export const DEMAND_DATA = {
  hourlyDemand: [
    { hour: '00:00', total: 320400, weekday: 210200, weekend: 540800 },
    { hour: '01:00', total: 245100, weekday: 145000, weekend: 445300 },
    { hour: '02:00', total: 182300, weekday: 98400, weekend: 350100 },
    { hour: '03:00', total: 142000, weekday: 82100, weekend: 261800 },
    { hour: '04:00', total: 165400, weekday: 124500, weekend: 247200 },
    { hour: '05:00', total: 265800, weekday: 289400, weekend: 218600 },
    { hour: '06:00', total: 458900, weekday: 554200, weekend: 268300 },
    { hour: '07:00', total: 785200, weekday: 984100, weekend: 387400 },
    { hour: '08:00', total: 1042500, weekday: 1358200, weekend: 411100 }, // Morning Peak
    { hour: '09:00', total: 948100, weekday: 1195400, weekend: 453500 },
    { hour: '10:00', total: 812400, weekday: 945600, weekend: 546000 },
    { hour: '11:00', total: 789500, weekday: 864200, weekend: 640100 },
    { hour: '12:00', total: 825400, weekday: 878900, weekend: 718400 },
    { hour: '13:00', total: 846200, weekday: 894500, weekend: 749600 },
    { hour: '14:00', total: 894100, weekday: 928300, weekend: 825700 },
    { hour: '15:00', total: 968300, weekday: 1012400, weekend: 880100 },
    { hour: '16:00', total: 1054200, weekday: 1145000, weekend: 872600 },
    { hour: '17:00', total: 1215400, weekday: 1395800, weekend: 854600 },
    { hour: '18:00', total: 1324800, weekday: 1542100, weekend: 890200 }, // Evening Peak
    { hour: '19:00', total: 1258600, weekday: 1412000, weekend: 951800 },
    { hour: '20:00', total: 1098400, weekday: 1184300, weekend: 926600 },
    { hour: '21:00', total: 985600, weekday: 994200, weekend: 968400 },
    { hour: '22:00', total: 874200, weekday: 821400, weekend: 979800 },
    { hour: '23:00', total: 548100, weekday: 462100, weekend: 720100 },
  ],
  dailyDemand: [
    { day: 'Monday', trips: 2415000, avgFare: 25.80, avgDuration: 20.8 },
    { day: 'Tuesday', trips: 2498000, avgFare: 26.05, avgDuration: 21.2 },
    { day: 'Wednesday', trips: 2584000, avgFare: 26.30, avgDuration: 21.5 },
    { day: 'Thursday', trips: 2712000, avgFare: 26.90, avgDuration: 22.1 },
    { day: 'Friday', trips: 3045000, avgFare: 28.10, avgDuration: 23.4 },
    { day: 'Saturday', trips: 3184000, avgFare: 28.95, avgDuration: 19.8 },
    { day: 'Sunday', trips: 2054840, avgFare: 26.70, avgDuration: 18.9 },
  ],
  weeklyHeatmapDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  boroughDemand: [
    { borough: 'Manhattan', trips: 8913500, percentage: 48.2, avgFare: 23.40, avgDistance: 2.95, avgDuration: 18.2, color: '#0ea5e9' },
    { borough: 'Brooklyn', trips: 4456800, percentage: 24.1, avgFare: 24.80, avgDistance: 4.85, avgDuration: 22.4, color: '#06b6d4' },
    { borough: 'Queens', trips: 3569100, percentage: 19.3, avgFare: 34.60, avgDistance: 7.92, avgDuration: 27.8, color: '#3b82f6' },
    { borough: 'Bronx', trips: 1331500, percentage: 7.2, avgFare: 26.20, avgDistance: 5.65, avgDuration: 21.9, color: '#6366f1' },
    { borough: 'Staten Island', trips: 221940, percentage: 1.2, avgFare: 36.50, avgDistance: 8.85, avgDuration: 28.4, color: '#a855f7' },
  ],
  topPickupZones: [
    { rank: 1, id: 132, name: 'JFK Airport', borough: 'Queens', trips: 1026000, share: '5.55%', avgFare: 68.50 },
    { rank: 2, id: 230, name: 'Times Sq / Theater District', borough: 'Manhattan', trips: 942000, share: '5.09%', avgFare: 24.30 },
    { rank: 3, id: 161, name: 'Midtown Center', borough: 'Manhattan', trips: 894000, share: '4.83%', avgFare: 25.90 },
    { rank: 4, id: 237, name: 'Upper East Side South', borough: 'Manhattan', trips: 858000, share: '4.64%', avgFare: 22.40 },
    { rank: 5, id: 138, name: 'LaGuardia Airport', borough: 'Queens', trips: 804000, share: '4.35%', avgFare: 44.20 },
    { rank: 6, id: 186, name: 'Penn Station / Madison Sq', borough: 'Manhattan', trips: 785000, share: '4.24%', avgFare: 24.75 },
    { rank: 7, id: 255, name: 'Williamsburg (North Side)', borough: 'Brooklyn', trips: 684000, share: '3.70%', avgFare: 24.10 },
    { rank: 8, id: 79, name: 'East Village', borough: 'Manhattan', trips: 652000, share: '3.53%', avgFare: 19.80 },
    { rank: 9, id: 236, name: 'Upper East Side North', borough: 'Manhattan', trips: 631000, share: '3.41%', avgFare: 21.90 },
    { rank: 10, id: 65, name: 'Downtown Brooklyn', borough: 'Brooklyn', trips: 592000, share: '3.20%', avgFare: 23.20 },
  ],
  topDropoffZones: [
    { rank: 1, id: 230, name: 'Times Sq / Theater District', borough: 'Manhattan', trips: 985000, share: '5.33%', avgFare: 24.50 },
    { rank: 2, id: 161, name: 'Midtown Center', borough: 'Manhattan', trips: 928000, share: '5.02%', avgFare: 25.80 },
    { rank: 3, id: 132, name: 'JFK Airport', borough: 'Queens', trips: 867000, share: '4.69%', avgFare: 67.20 },
    { rank: 4, id: 237, name: 'Upper East Side South', borough: 'Manhattan', trips: 831000, share: '4.49%', avgFare: 22.10 },
    { rank: 5, id: 186, name: 'Penn Station / Madison Sq', borough: 'Manhattan', trips: 814000, share: '4.40%', avgFare: 24.60 },
    { rank: 6, id: 255, name: 'Williamsburg (North Side)', borough: 'Brooklyn', trips: 712000, share: '3.85%', avgFare: 24.30 },
    { rank: 7, id: 79, name: 'East Village', borough: 'Manhattan', trips: 698000, share: '3.77%', avgFare: 19.90 },
    { rank: 8, id: 138, name: 'LaGuardia Airport', borough: 'Queens', trips: 663000, share: '3.59%', avgFare: 43.80 },
    { rank: 9, id: 234, name: 'Union Sq', borough: 'Manhattan', trips: 622000, share: '3.36%', avgFare: 20.80 },
    { rank: 10, id: 65, name: 'Downtown Brooklyn', borough: 'Brooklyn', trips: 615000, share: '3.33%', avgFare: 23.40 },
  ],
  weekdayVsWeekendSummary: {
    weekdayTrips: '13,254,000 (71.7%)',
    weekendTrips: '5,238,840 (28.3%)',
    weekdayAvgSpeed: '11.4 mph',
    weekendAvgSpeed: '14.2 mph',
    weekdayPeakHour: '18:00 (1.54M trips)',
    weekendPeakHour: '22:00 (0.98M trips)'
  }
};

export const BEHAVIOUR_DATA = {
  timePeriods: [
    { period: 'Morning (06:00 - 12:00)', trips: 4843600, percentage: '26.2%', avgDistance: 4.65, avgDuration: 22.1, avgFare: 25.40, avgSpeed: 12.6 },
    { period: 'Afternoon (12:00 - 17:00)', trips: 4588200, percentage: '24.8%', avgDistance: 4.42, avgDuration: 23.8, avgFare: 26.10, avgSpeed: 11.1 },
    { period: 'Evening (17:00 - 22:00)', trips: 5882400, percentage: '31.8%', avgDistance: 5.15, avgDuration: 24.2, avgFare: 29.30, avgSpeed: 12.8 },
    { period: 'Night (22:00 - 06:00)', trips: 3178640, percentage: '17.2%', avgDistance: 5.35, avgDuration: 15.6, avgFare: 26.60, avgSpeed: 20.6 }
  ],
  distanceDistribution: [
    { range: '0 - 2 mi', count: 5178000, percentage: 28.0, share: '28.0%' },
    { range: '2 - 5 mi', count: 6657400, percentage: 36.0, share: '36.0%' },
    { range: '5 - 10 mi', count: 3883500, percentage: 21.0, share: '21.0%' },
    { range: '10 - 15 mi', count: 1664300, percentage: 9.0, share: '9.0%' },
    { range: '15 - 25 mi', count: 924600, percentage: 5.0, share: '5.0%' },
    { range: '25+ mi', count: 184940, percentage: 1.0, share: '1.0%' },
  ],
  durationDistribution: [
    { range: '< 10 min', count: 3328700, percentage: 18.0, share: '18.0%' },
    { range: '10 - 20 min', count: 7027300, percentage: 38.0, share: '38.0%' },
    { range: '20 - 30 min', count: 4438300, percentage: 24.0, share: '24.0%' },
    { range: '30 - 45 min', count: 2219100, percentage: 12.0, share: '12.0%' },
    { range: '45 - 60 min', count: 1109600, percentage: 6.0, share: '6.0%' },
    { range: '> 60 min', count: 369800, percentage: 2.0, share: '2.0%' },
  ],
  fareDistribution: [
    { range: '$0 - $15', count: 4068400, percentage: 22.0 },
    { range: '$15 - $30', count: 8136900, percentage: 44.0 },
    { range: '$30 - $50', count: 4068400, percentage: 22.0 },
    { range: '$50 - $75', count: 1479400, percentage: 8.0 },
    { range: '$75 - $100', count: 554800, percentage: 3.0 },
    { range: '$100+', count: 184940, percentage: 1.0 },
  ],
  sharedVsNonShared: {
    nonShared: {
      trips: 18097100,
      percentage: 97.86,
      avgFare: 27.15,
      avgDuration: 21.2,
      avgDistance: 4.84,
      avgDriverPay: 19.65
    },
    shared: {
      trips: 395740,
      percentage: 2.14,
      avgFare: 17.80,
      avgDuration: 27.6,
      avgDistance: 4.25,
      avgDriverPay: 14.10
    }
  },
  serviceProviders: [
    {
      licenseNumber: 'HV0003',
      provider: 'Uber Technologies',
      trips: 13203890,
      marketShare: 71.4,
      avgFare: 27.10,
      avgDriverPay: 19.60,
      avgSpeed: 11.8,
      avgDistance: 4.88,
      sharedRideRate: 2.3
    },
    {
      licenseNumber: 'HV0005',
      provider: 'Lyft Inc.',
      trips: 5288950,
      marketShare: 28.6,
      avgFare: 26.20,
      avgDriverPay: 18.95,
      avgSpeed: 12.1,
      avgDistance: 4.67,
      sharedRideRate: 1.8
    }
  ],
  avgDurationByZone: [
    { zone: 'JFK Airport', duration: 48.2, distance: 16.2 },
    { zone: 'LaGuardia Airport', duration: 32.5, distance: 8.8 },
    { zone: 'Riverdale (Bronx)', duration: 28.4, distance: 7.9 },
    { zone: 'Midtown Center', duration: 21.8, distance: 3.1 },
    { zone: 'Times Square', duration: 22.5, distance: 2.9 },
    { zone: 'Williamsburg', duration: 18.9, distance: 3.4 },
    { zone: 'East Village', duration: 17.2, distance: 2.6 },
    { zone: 'Downtown Brooklyn', duration: 20.4, distance: 4.1 },
  ]
};

export const ANOMALY_DATA = {
  summary: {
    totalAnomalies: 2845,
    anomalyRate: '0.0154%',
    tripLevelAnomalies: 2410,
    demandLevelAnomalies: 435,
    sparkFilterMethod: 'PySpark Interquartile Range (IQR) & Isolation Forest v3.2',
    flaggedValueAmount: '$148,920'
  },
  categories: [
    { name: 'Extreme Trip Duration', count: 842, percentage: 29.6, color: '#f43f5e' },
    { name: 'Spatial / Distance Discrepancy', count: 694, percentage: 24.4, color: '#f59e0b' },
    { name: 'Abnormal Fare Values', count: 518, percentage: 18.2, color: '#0ea5e9' },
    { name: 'Impossible Speed Combination', count: 426, percentage: 15.0, color: '#a855f7' },
    { name: 'Zone Demand Surges', count: 365, percentage: 12.8, color: '#10b981' }
  ],
  zoneSpikes: [
    { zone: 'Citi Field (Queens)', spikeFactor: '+420%', baselinePerHour: 320, observedPerHour: 1664, reason: 'MLB Playoff Game egress wave' },
    { zone: 'Barclays Center (Brooklyn)', spikeFactor: '+340%', baselinePerHour: 480, observedPerHour: 2112, reason: 'Arena concert termination' },
    { zone: 'Bedford Ave (Brooklyn)', spikeFactor: '+280%', baselinePerHour: 610, observedPerHour: 2318, reason: 'MTA L-Train weekend service shutdown' },
    { zone: 'Flushing Meadows (Queens)', spikeFactor: '+310%', baselinePerHour: 290, observedPerHour: 1189, reason: 'US Open tennis tournament peak' },
    { zone: 'Randalls Island (Manhattan)', spikeFactor: '+510%', baselinePerHour: 80, observedPerHour: 488, reason: 'Music festival departure surge' },
  ],
  records: [
    {
      id: 'TRIP-99042',
      timestamp: '2024-10-28 03:14:22',
      pickupZone: 'Midtown Center (Manhattan)',
      dropoffZone: 'East Village (Manhattan)',
      distanceMi: 1.4,
      durationMin: 184.2,
      fare: 34.50,
      category: 'Extreme Trip Duration',
      severity: 'Critical',
      reason: 'Duration exceeds 3.0 standard deviations (184 mins for 1.4 mi); driver likely forgot to end meter.'
    },
    {
      id: 'TRIP-98412',
      timestamp: '2024-10-27 19:42:10',
      pickupZone: 'Times Sq / Theater Dist',
      dropoffZone: 'Upper West Side',
      distanceMi: 2.1,
      durationMin: 14.8,
      fare: 485.00,
      category: 'Abnormal Fare Values',
      severity: 'Critical',
      reason: 'Fare exceeds 99.9th percentile ($485 vs historical median $18.40) with no recorded congestion surcharge.'
    },
    {
      id: 'TRIP-97218',
      timestamp: '2024-10-26 14:10:05',
      pickupZone: 'JFK Airport',
      dropoffZone: 'Flushing (Queens)',
      distanceMi: 88.4,
      durationMin: 32.0,
      fare: 74.00,
      category: 'Impossible Speed Combination',
      severity: 'Critical',
      reason: 'Calculated ground speed of 165.7 mph is physically impossible for road transit; GPS telematics error.'
    },
    {
      id: 'TRIP-96534',
      timestamp: '2024-10-25 08:30:19',
      pickupZone: 'Williamsburg North',
      dropoffZone: 'Williamsburg North',
      distanceMi: 0.0,
      durationMin: 52.4,
      fare: 62.00,
      category: 'Spatial / Distance Discrepancy',
      severity: 'Moderate',
      reason: 'Zero net distance traversed over 52 minutes while incurring passenger charges.'
    },
    {
      id: 'TRIP-95881',
      timestamp: '2024-10-24 23:18:44',
      pickupZone: 'Financial District North',
      dropoffZone: 'St. George (Staten Island)',
      distanceMi: 18.2,
      durationMin: 12.1,
      fare: 42.00,
      category: 'Impossible Speed Combination',
      severity: 'Moderate',
      reason: 'Trip across Verrazzano Narrows clocked at 90.2 mph average during moderate traffic.'
    },
    {
      id: 'TRIP-95104',
      timestamp: '2024-10-24 18:05:12',
      pickupZone: 'Citi Field',
      dropoffZone: 'Crown Heights North',
      distanceMi: 12.8,
      durationMin: 142.0,
      fare: 148.50,
      category: 'Zone Demand Surges',
      severity: 'Moderate',
      reason: 'Post-event gridlock resulted in 5.4 mph progress with sustained dynamic surge multiplier of 3.8x.'
    },
    {
      id: 'TRIP-94920',
      timestamp: '2024-10-23 04:12:30',
      pickupZone: 'Penn Station',
      dropoffZone: 'Penn Station',
      distanceMi: 0.1,
      durationMin: 98.6,
      fare: 89.00,
      category: 'Spatial / Distance Discrepancy',
      severity: 'Critical',
      reason: 'Stationary taxi running meter on transit curb for 98 minutes without geographic relocation.'
    },
    {
      id: 'TRIP-93874',
      timestamp: '2024-10-22 17:48:19',
      pickupZone: 'LaGuardia Airport',
      dropoffZone: 'Upper East Side South',
      distanceMi: 8.4,
      durationMin: 22.0,
      fare: 0.00,
      category: 'Abnormal Fare Values',
      severity: 'Moderate',
      reason: 'Fare logged as exactly $0.00 on a completed 8.4-mile airport haul.'
    },
    {
      id: 'TRIP-93112',
      timestamp: '2024-10-21 21:15:00',
      pickupZone: 'Downtown Brooklyn',
      dropoffZone: 'Bushwick South',
      distanceMi: 3.8,
      durationMin: 210.5,
      fare: 54.00,
      category: 'Extreme Trip Duration',
      severity: 'Critical',
      reason: 'Trip spanned 3.5 hours for short inter-borough commute; potential app suspension anomaly.'
    },
    {
      id: 'TRIP-92450',
      timestamp: '2024-10-20 02:44:11',
      pickupZone: 'Lower East Side',
      dropoffZone: 'Riverdale (Bronx)',
      distanceMi: 42.1,
      durationMin: 21.0,
      fare: 82.00,
      category: 'Impossible Speed Combination',
      severity: 'Critical',
      reason: 'Recorded travel velocity of 120.3 mph across FDR Drive and Major Deegan Expressway.'
    },
    {
      id: 'TRIP-91980',
      timestamp: '2024-10-19 16:32:48',
      pickupZone: 'Barclays Center',
      dropoffZone: 'Bedford',
      distanceMi: 1.2,
      durationMin: 64.0,
      fare: 96.00,
      category: 'Zone Demand Surges',
      severity: 'Low',
      reason: 'Localized egress gridlock accompanied by 4.2x algorithmic surge pricing.'
    },
    {
      id: 'TRIP-91220',
      timestamp: '2024-10-18 12:05:33',
      pickupZone: 'JFK Airport',
      dropoffZone: 'Newark Airport (NJ)',
      distanceMi: 38.6,
      durationMin: 245.0,
      fare: 310.00,
      category: 'Extreme Trip Duration',
      severity: 'Moderate',
      reason: 'Severe interstate tunnel congestion compounded by construction detour.'
    }
  ]
};

export const FORECAST_DATA = {
  metrics: {
    mae: 42.8,
    maeUnit: 'trips/zone/hr',
    rmse: 58.4,
    rmseUnit: 'trips/zone/hr',
    mape: '4.12%',
    r2Score: 0.942,
    modelArchitecture: 'PySpark GBDT Regressor + Fourier Lag Ensembling',
    lastTrained: '2024-10-31 02:00 UTC',
    validationSamples: '1,849,280 trips'
  },
  historicalVsPredicted: [
    { time: 'Day -6', actual: 592400, predicted: 588100, lowerBound: 565000, upperBound: 611200 },
    { time: 'Day -5', actual: 604100, predicted: 611400, lowerBound: 587000, upperBound: 635800 },
    { time: 'Day -4', actual: 618500, predicted: 614200, lowerBound: 590000, upperBound: 638400 },
    { time: 'Day -3', actual: 645200, predicted: 639800, lowerBound: 615000, upperBound: 664600 },
    { time: 'Day -2', actual: 712800, predicted: 719500, lowerBound: 692000, upperBound: 747000 },
    { time: 'Day -1', actual: 748900, predicted: 741200, lowerBound: 713000, upperBound: 769400 },
    { time: 'Today', actual: 631200, predicted: 634800, lowerBound: 610000, upperBound: 659600 },
    { time: 'Day +1', actual: null, predicted: 594200, lowerBound: 569000, upperBound: 619400 },
    { time: 'Day +2', actual: null, predicted: 608100, lowerBound: 581000, upperBound: 635200 },
    { time: 'Day +3', actual: null, predicted: 622400, lowerBound: 593000, upperBound: 651800 },
    { time: 'Day +4', actual: null, predicted: 652000, lowerBound: 620000, upperBound: 684000 },
    { time: 'Day +5', actual: null, predicted: 728900, lowerBound: 692000, upperBound: 765800 },
    { time: 'Day +6', actual: null, predicted: 764200, lowerBound: 724000, upperBound: 804400 },
    { time: 'Day +7', actual: null, predicted: 648000, lowerBound: 612000, upperBound: 684000 },
  ],
  hourlyForecastNext24: [
    { hour: '00:00', predicted: 318000, lowerBound: 298000, upperBound: 338000, confidence: '96.2%' },
    { hour: '02:00', predicted: 179000, lowerBound: 162000, upperBound: 196000, confidence: '95.8%' },
    { hour: '04:00', predicted: 161000, lowerBound: 145000, upperBound: 177000, confidence: '95.1%' },
    { hour: '06:00', predicted: 462000, lowerBound: 435000, upperBound: 489000, confidence: '94.8%' },
    { hour: '08:00', predicted: 1065000, lowerBound: 1010000, upperBound: 1120000, confidence: '93.9%' },
    { hour: '10:00', predicted: 824000, lowerBound: 782000, upperBound: 866000, confidence: '94.5%' },
    { hour: '12:00', predicted: 839000, lowerBound: 798000, upperBound: 880000, confidence: '95.0%' },
    { hour: '14:00', predicted: 902000, lowerBound: 859000, upperBound: 945000, confidence: '94.6%' },
    { hour: '16:00', predicted: 1084000, lowerBound: 1032000, upperBound: 1136000, confidence: '93.7%' },
    { hour: '18:00', predicted: 1342000, lowerBound: 1275000, upperBound: 1409000, confidence: '93.2%' },
    { hour: '20:00', predicted: 1115000, lowerBound: 1060000, upperBound: 1170000, confidence: '94.1%' },
    { hour: '22:00', predicted: 889000, lowerBound: 842000, upperBound: 936000, confidence: '95.3%' },
  ],
  zonePredictedDemand: [
    { zone: 'JFK Airport', borough: 'Queens', currentDaily: 34200, predictedDaily: 36800, changePct: '+7.6%', confidence: '96.4%' },
    { zone: 'Times Square', borough: 'Manhattan', currentDaily: 42100, predictedDaily: 44900, changePct: '+6.7%', confidence: '95.8%' },
    { zone: 'Midtown Center', borough: 'Manhattan', currentDaily: 39800, predictedDaily: 41800, changePct: '+5.0%', confidence: '94.9%' },
    { zone: 'LaGuardia Airport', borough: 'Queens', currentDaily: 26800, predictedDaily: 28400, changePct: '+6.0%', confidence: '95.2%' },
    { zone: 'Williamsburg North', borough: 'Brooklyn', currentDaily: 29800, predictedDaily: 32100, changePct: '+7.7%', confidence: '94.1%' },
    { zone: 'Penn Station', borough: 'Manhattan', currentDaily: 36700, predictedDaily: 38200, changePct: '+4.1%', confidence: '95.5%' },
    { zone: 'East Village', borough: 'Manhattan', currentDaily: 31500, predictedDaily: 33400, changePct: '+6.0%', confidence: '93.8%' },
    { zone: 'Downtown Brooklyn', borough: 'Brooklyn', currentDaily: 23600, predictedDaily: 25100, changePct: '+6.4%', confidence: '94.4%' }
  ]
};
