import { useState, useCallback } from 'react';
import { useApi } from './useApi';

export interface Survey {
  id: string;
  ticketId: string;
  rating: number;
  feedback?: string;
  serviceQuality: number;
  responseTime: number;
  technicianRating: number;
  wouldRecommend: boolean;
  submittedAt: string;
  submittedBy: string;
}

export interface SurveyStats {
  averageRating: number;
  totalResponses: number;
  satisfactionRate: number;
  responseRate: number;
  ratingBreakdown: {
    rating: number;
    count: number;
    percentage: number;
  }[];
}

export function useSurvey() {
  const api = useApi();
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [stats, setStats] = useState<SurveyStats | null>(null);

  const getSurveyByTicket = useCallback(async (ticketId: string) => {
    try {
      const result = await api.execute(`/surveys/ticket/${ticketId}`);
      return result;
    } catch (error) {
      console.error('Failed to fetch survey:', error);
      throw error;
    }
  }, [api]);

  const submitSurvey = useCallback(async (data: Omit<Survey, 'id' | 'submittedAt' | 'submittedBy'>) => {
    try {
      const result = await api.execute('/surveys', {
        method: 'POST',
        body: data,
      });
      
      if (result) {
        setSurveys(prev => [...prev, result]);
      }
      return result;
    } catch (error) {
      console.error('Failed to submit survey:', error);
      throw error;
    }
  }, [api]);

  const getSurveyStats = useCallback(async (dateRange?: {
    startDate: string;
    endDate: string;
  }) => {
    try {
      const query = new URLSearchParams();
      if (dateRange?.startDate) query.set('startDate', dateRange.startDate);
      if (dateRange?.endDate) query.set('endDate', dateRange.endDate);

      const endpoint = `/surveys/stats?${query.toString()}`;
      const result = await api.execute(endpoint);
      
      if (result) {
        setStats(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch survey stats:', error);
      throw error;
    }
  }, [api]);

  const getAllSurveys = useCallback(async (filters?: {
    rating?: number;
    technicianId?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    try {
      const query = new URLSearchParams();
      if (filters?.rating) query.set('rating', String(filters.rating));
      if (filters?.technicianId) query.set('technicianId', filters.technicianId);
      if (filters?.startDate) query.set('startDate', filters.startDate);
      if (filters?.endDate) query.set('endDate', filters.endDate);

      const endpoint = `/surveys?${query.toString()}`;
      const result = await api.execute(endpoint);
      
      if (result) {
        setSurveys(result);
      }
      return result;
    } catch (error) {
      console.error('Failed to fetch surveys:', error);
      throw error;
    }
  }, [api]);

  return {
    surveys,
    stats,
    loading: api.loading,
    error: api.error,
    getSurveyByTicket,
    submitSurvey,
    getSurveyStats,
    getAllSurveys,
    refreshStats: () => getSurveyStats(),
  };
}