export const RecentUsageSortingMode = {
  LATEST_REGISTRANT: 'Most Recent Registrant',
  TOTAL_REGISTRANTS: 'Total Registrants',
  LATEST_UPDATE: 'Most Recent Update to Client',
  LATEST_VISIT: 'Most Recent Visit',
  TOTAL_VISITS: 'Total Visits',
};

export const RecentUsageSortingModeToSortingKey = {};
RecentUsageSortingModeToSortingKey[RecentUsageSortingMode.LATEST_REGISTRANT] = 'latestRegistrant';
RecentUsageSortingModeToSortingKey[RecentUsageSortingMode.TOTAL_REGISTRANTS] = 'totalRegistrants';
RecentUsageSortingModeToSortingKey[RecentUsageSortingMode.LATEST_UPDATE] = 'latestUpdate';
RecentUsageSortingModeToSortingKey[RecentUsageSortingMode.LATEST_VISIT] = 'latestVisit';
RecentUsageSortingModeToSortingKey[RecentUsageSortingMode.TOTAL_VISITS] = 'totalVisits';
