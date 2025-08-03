import { useState, useEffect } from 'react';
import { reportsApi, DashboardStats, UrgentIssue, DepartmentPerformance, PeakHour } from '@/api/reports';

interface ReportsData {
  dashboardStats: DashboardStats | null;
  urgentIssues: UrgentIssue[];
  departmentPerformance: DepartmentPerformance[];
  peakHours: PeakHour[];
  loading: boolean;
  error: string | null;
}

export const useReportsData = (organizationId: number | undefined) => {
  const [data, setData] = useState<ReportsData>({
    dashboardStats: null,
    urgentIssues: [],
    departmentPerformance: [],
    peakHours: [],
    loading: true,
    error: null,
  });

  const fetchData = async () => {
    if (!organizationId) return;

    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      const [dashboardStats, urgentIssues, departmentPerformance, peakHours] = await Promise.all([
        reportsApi.getDashboardStats(organizationId),
        reportsApi.getUrgentIssues(organizationId),
        reportsApi.getDepartmentPerformance(organizationId),
        reportsApi.getPeakHours(organizationId),
      ]);

      setData({
        dashboardStats,
        urgentIssues,
        departmentPerformance,
        peakHours,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching reports data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to fetch reports data',
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [organizationId]);

  return {
    ...data,
    refetch: fetchData,
  };
}; 