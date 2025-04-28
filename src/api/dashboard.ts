/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";

interface DashboardSummaryResponse {
  success: boolean;
  message: string;
  data: {
    activitySummary: {
      totalMoodEntries: number;
      totalJournalEntries: number;
      totalChatSessions: number;
    };
    goalProgress: {
      totalGoals: number;
      completedGoals: number;
      completionRate: number;
    };
    insights: {
      weekly: Array<any>;
      monthly: Array<any>;
      suggestions: Array<any>;
    };
    recentActivity: {
      moods: Array<any>;
      journals: Array<any>;
      chats: Array<any>;
    };
    emotionFrequency: Record<string, number>;
    moodTrends: Array<{
      date: string;
      count: number;
      emotions: string[];
    }>;
    struggles: Array<any>;
  };
}

interface AnalyticsResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface MoodAnalyticsData {
  moodEntries: number;
  period: string;
  emotionFrequency: Record<string, number>;
  dailyEmotions: Record<string, string[]>;
  emotionTrends: Record<string, Record<string, number>>;
  allEmotions: string[];
}

interface JournalAnalyticsData {
  journalCount: number;
  period: string;
  journalsByDay: Record<string, number>;
  emotions: Record<string, number>;
  tags: Record<string, number>;
  averageLength: number;
}

interface GoalAnalyticsData {
  totalGoals: number;
  completedGoals: number;
  incompleteGoals: number;
  completionRate: number;
  goals: Array<any>;
  completedByDate: Record<string, number>;
}

interface InsightAnalyticsData {
  insightCounts: {
    weekly: number;
    monthly: number;
    suggestions: number;
    total: number;
  };
  weeklyInsightsByDate: Record<string, Array<any>>;
  monthlyInsightsByDate: Record<string, Array<any>>;
  suggestionsByDate: Record<string, Array<any>>;
  latestUpdate: {
    weekly: string | null;
    monthly: string | null;
  };
}

interface ChatAnalyticsData {
  totalChats: number;
  totalMessages: number;
  messageBreakdown: {
    user: number;
    ai: number;
  };
  averageMessagesPerChat: number;
  period: string;
  chatsByDay: Record<string, number>;
  messagesByDay: Record<
    string,
    {
      user: number;
      ai: number;
      total: number;
    }
  >;
}

// Get dashboard summary
export const getDashboardSummary = async () => {
  try {
    const res = await api.get("/dashboard/summary");
    return res.data as DashboardSummaryResponse;
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    throw error;
  }
};

// Get mood analytics
export const getMoodAnalytics = async (period: string = "30days") => {
  try {
    const res = await api.get(`/dashboard/mood-analytics?period=${period}`);
    return res.data as AnalyticsResponse<MoodAnalyticsData>;
  } catch (error) {
    console.error("Error fetching mood analytics:", error);
    throw error;
  }
};

// Get journal analytics
export const getJournalAnalytics = async (period: string = "30days") => {
  try {
    const res = await api.get(`/dashboard/journal-analytics?period=${period}`);
    return res.data as AnalyticsResponse<JournalAnalyticsData>;
  } catch (error) {
    console.error("Error fetching journal analytics:", error);
    throw error;
  }
};

// Get goal analytics
export const getGoalAnalytics = async () => {
  try {
    const res = await api.get(`/dashboard/goal-analytics`);
    return res.data as AnalyticsResponse<GoalAnalyticsData>;
  } catch (error) {
    console.error("Error fetching goal analytics:", error);
    throw error;
  }
};

// Get insight analytics
export const getInsightAnalytics = async () => {
  try {
    const res = await api.get(`/dashboard/insight-analytics`);
    return res.data as AnalyticsResponse<InsightAnalyticsData>;
  } catch (error) {
    console.error("Error fetching insight analytics:", error);
    throw error;
  }
};

// Get chat analytics
export const getChatAnalytics = async (period: string = "30days") => {
  try {
    const res = await api.get(`/dashboard/chat-analytics?period=${period}`);
    return res.data as AnalyticsResponse<ChatAnalyticsData>;
  } catch (error) {
    console.error("Error fetching chat analytics:", error);
    throw error;
  }
};
