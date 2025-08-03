import { api } from "../index";

export interface DashboardStats {
  totalCallsToday: number;
  avgResolutionTime: string;
  staffResponseRate: number;
  guestSatisfaction: number;
  changes: {
    totalCallsToday: string;
    avgResolutionTime: string;
    staffResponseRate: string;
    guestSatisfaction: string;
  };
}

export interface UrgentIssue {
  id: number;
  title: string;
  location: string;
  timeAgo: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DepartmentPerformance {
  name: string;
  completionRate: number;
  color: string;
}

export interface PeakHour {
  timeRange: string;
  callCount: number;
  percentage: number;
}

export const reportsApi = {
  // Get dashboard statistics
  getDashboardStats: async (organizationId: number): Promise<DashboardStats> => {
    const response = await api.get(`/reports/dashboard-stats?organizationId=${organizationId}`);
    return response.data;
  },

  // Get urgent/open issues
  getUrgentIssues: async (organizationId: number): Promise<UrgentIssue[]> => {
    const response = await api.get(`/reports/urgent-issues?organizationId=${organizationId}`);
    return response.data;
  },

  // Get department performance
  getDepartmentPerformance: async (organizationId: number): Promise<DepartmentPerformance[]> => {
    const response = await api.get(`/reports/department-performance?organizationId=${organizationId}`);
    return response.data;
  },

  // Get peak hours analysis
  getPeakHours: async (organizationId: number): Promise<PeakHour[]> => {
    const response = await api.get(`/reports/peak-hours?organizationId=${organizationId}`);
    return response.data;
  },

  // Existing endpoints
  getAverageCloseTime: async (organizationId: number): Promise<number> => {
    const response = await api.get(`/reports/averageCloseTime?organizationId=${organizationId}`);
    return response.data;
  },

  getTopClosers: async (organizationId: number) => {
    const response = await api.get(`/reports/topClosers?organizationId=${organizationId}`);
    return response.data;
  },

  getCallsByCategory: async (organizationId: number) => {
    const response = await api.get(`/reports/callsByCategory?organizationId=${organizationId}`);
    return response.data;
  },

  getStatusPie: async (organizationId: number) => {
    const response = await api.get(`/reports/statusPie?organizationId=${organizationId}`);
    return response.data;
  },
}; 