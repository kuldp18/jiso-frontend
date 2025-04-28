/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
import {
  Activity,
  CheckCircle2,
  FileText,
  MessageCircle,
  Smile,
  TrendingUp,
  Loader2,
  BarChart3,
  BrainCircuit,
  Calendar,
  ArrowRight,
  RefreshCcw,
  CheckCheck,
  Clock,
  Lightbulb,
  LineChart as LineChartIcon,
  HeartPulse,
} from "lucide-react";
import { format, parseISO } from "date-fns";

// Dashboard components - using all the specialized components
import MoodSummaryCard from "@/components/dashboard/MoodSummaryCard";
import JournalSummaryCard from "@/components/dashboard/JournalSummaryCard";
import GoalProgressCard from "@/components/dashboard/GoalProgressCard";
import InsightsCard from "@/components/dashboard/InsightsCard";
import EmotionChart from "@/components/dashboard/EmotionChart";

// Import the dashboard store
import { useDashboardStore } from "@/stores/dashboardStore";
import { cn } from "@/lib/utils";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  // Use the dashboard store
  const { isLoading, error, dashboardData, fetchDashboardSummary } =
    useDashboardStore();

  useEffect(() => {
    // Fetch dashboard data when component mounts
    const loadDashboardData = async () => {
      try {
        await fetchDashboardSummary();
      } catch (err) {
        console.error("Dashboard error:", err);
      }
    };

    loadDashboardData();
  }, [fetchDashboardSummary]);

  // Handle manual refresh button
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchDashboardSummary();
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading your dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center">
        <div className="text-destructive text-lg mb-4">{error}</div>
        <Button onClick={() => fetchDashboardSummary()}>Retry</Button>
      </div>
    );
  }

  // Convert mood emotion frequency to chart data
  const emotionData = dashboardData?.emotionFrequency
    ? Object.entries(dashboardData.emotionFrequency).map(([name, value]) => ({
        name,
        value: Number(value),
      }))
    : [];

  // Prepare mood trend data for chart
  const moodTrendData = dashboardData?.moodTrends
    ? dashboardData.moodTrends
        .sort(
          (a: any, b: any) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
        .map((trend: any) => ({
          date: format(parseISO(trend.date), "MMM d"),
          count: trend.count,
        }))
    : [];

  // Generate weekly engagement chart for analytics tab
  const weeklyEngagementData = [
    { day: "Mon", moods: 2, journals: 1, chats: 0 },
    { day: "Tue", moods: 1, journals: 0, chats: 1 },
    { day: "Wed", moods: 3, journals: 2, chats: 0 },
    { day: "Thu", moods: 1, journals: 1, chats: 0 },
    { day: "Fri", moods: 2, journals: 0, chats: 1 },
    { day: "Sat", moods: 0, journals: 1, chats: 0 },
    { day: "Sun", moods: 2, journals: 1, chats: 1 },
  ];

  // Prepare recent moods for MoodSummaryCard
  const recentMoods =
    dashboardData?.recentActivity?.moods?.slice(0, 3).map((mood: any) => ({
      _id: mood._id,
      emotions: mood.emotions || [],
      createdAt: mood.createdAt || new Date().toISOString(),
    })) || [];

  // Prepare recent journal entries for JournalSummaryCard
  const recentJournals =
    dashboardData?.recentActivity?.journals
      ?.slice(0, 2)
      .map((journal: any) => ({
        _id: journal._id,
        date: journal.date || journal.createdAt || new Date().toISOString(),
        summary:
          journal.summary ||
          journal.entry?.substring(0, 100) ||
          "Journal entry",
      })) || [];

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent">
            Your Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="flex items-center gap-1"
            disabled={isLoading || refreshing}
          >
            <RefreshCcw
              className={cn("h-4 w-4", refreshing && "animate-spin")}
            />
            Refresh
          </Button>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-[400px]"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" />
                Insights
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Tabs with content - each with DISTINCT visual style and components */}
      <Tabs value={activeTab} className="outline-none">
        {/* ===================== OVERVIEW TAB ===================== */}
        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards Row - Using existing specialized components */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <MoodSummaryCard
              recentMoods={recentMoods}
              totalEntries={
                dashboardData?.activitySummary?.totalMoodEntries || 0
              }
            />

            <JournalSummaryCard
              recentEntries={recentJournals}
              totalEntries={
                dashboardData?.activitySummary?.totalJournalEntries || 0
              }
            />

            {/* Activity Summary Card - completing the row */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-transparent">
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2 text-green-500" />
                  Chat Activity
                </CardTitle>
                <CardDescription>Recent conversations with Ana</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Total Sessions
                    </span>
                    <span className="font-medium">
                      {dashboardData?.activitySummary?.totalChatSessions || 0}
                    </span>
                  </div>

                  {dashboardData?.recentActivity?.chats?.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Recent Sessions</h4>
                      {dashboardData.recentActivity.chats
                        .slice(0, 2)
                        .map((chat: any) => (
                          <Link
                            key={chat._id}
                            to={`/dashboard/chats/${chat._id}`}
                            className="block p-2.5 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                          >
                            <div className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {chat.date &&
                                format(parseISO(chat.date), "MMM d, yyyy")}
                            </div>
                            <p className="line-clamp-1 text-sm font-medium mt-0.5">
                              {chat.title || "Chat with Ana"}
                            </p>
                          </Link>
                        ))}

                      <div className="flex justify-between pt-2">
                        <Button
                          asChild
                          variant="ghost"
                          size="sm"
                          className="text-sm px-0"
                        >
                          <Link
                            to="/dashboard/chats"
                            className="flex items-center text-muted-foreground hover:text-primary"
                          >
                            View All <ArrowRight className="h-4 w-4 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <MessageCircle className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">
                        No chat sessions yet
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link to="/dashboard/chats/new">Start Chatting</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Progress Card - Standalone */}
          <GoalProgressCard
            totalGoals={dashboardData?.goalProgress?.totalGoals || 0}
            completedGoals={dashboardData?.goalProgress?.completedGoals || 0}
            completionRate={dashboardData?.goalProgress?.completionRate || 0}
          />

          {/* Visualizations Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Using EmotionChart component */}
            <EmotionChart
              data={emotionData}
              title="Emotional Distribution"
              description="Your most frequent emotions from the past 30 days"
            />

            {/* Mood Trends Chart */}
            <Card className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="bg-gradient-to-r from-pink-500/10 to-transparent">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-pink-500" />
                  Mood Check-in Trends
                </CardTitle>
                <CardDescription>Your mood entries over time</CardDescription>
              </CardHeader>
              <CardContent>
                {moodTrendData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={moodTrendData}>
                        <defs>
                          <linearGradient
                            id="colorCount"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="hsl(320 100% 60%)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="hsl(320 100% 70%)"
                              stopOpacity={0.2}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(309 15% 25%)"
                        />
                        <XAxis dataKey="date" stroke="hsl(309 5% 65%)" />
                        <YAxis stroke="hsl(309 5% 65%)" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(309 50% 10%)",
                            borderColor: "hsl(309 30% 50%)",
                            borderRadius: "8px",
                            color: "hsl(309 5% 90%)",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="hsl(320 100% 60%)"
                          fillOpacity={1}
                          fill="url(#colorCount)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                    <TrendingUp className="h-12 w-12 mb-2 text-pink-500/40" />
                    <p>Record more moods to see trends</p>
                    <Button
                      asChild
                      variant="outline"
                      className="mt-4 border-pink-500/30 hover:border-pink-500/50"
                    >
                      <Link to="/dashboard/moods/create">Record Mood</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===================== INSIGHTS TAB ===================== */}
        <TabsContent
          value="insights"
          className="space-y-6 animate-in fade-in-50 duration-500"
        >
          {/* Distinct header for Insights tab with custom design */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-800 to-primary p-8 text-white shadow-lg">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-purple-800/80 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-white/90 p-2 text-purple-800">
                  <BrainCircuit className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">AI-Generated Insights</h2>
              </div>
              <p className="max-w-2xl text-purple-100">
                Our AI analyzes your journals, moods, and conversations to
                identify patterns and provide personalized insights to help you
                better understand yourself and your emotional well-being.
              </p>

              <div className="mt-4 flex flex-wrap gap-3">
                <div className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  <span className="text-white/90">Mood Analysis</span>
                </div>
                <div className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  <span className="text-white/90">Pattern Recognition</span>
                </div>
                <div className="rounded-lg bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                  <span className="text-white/90">
                    Personalized Recommendations
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Using the InsightsCard component */}
          <InsightsCard
            weeklyInsights={dashboardData?.insights?.weekly || []}
            monthlyInsights={dashboardData?.insights?.monthly || []}
            suggestions={dashboardData?.insights?.suggestions || []}
          />

          {/* Additional Insights Cards specific to this tab */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Connection Card - Insights specific content */}
            <Card className="border-purple-200/50 dark:border-purple-900/50">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent border-b border-purple-100/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-purple-500">
                  <HeartPulse className="h-5 w-5" />
                  Emotional Connections
                </CardTitle>
                <CardDescription>
                  How your emotions relate to your activities
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        data={[
                          { subject: "Journaling", A: 80, fullMark: 100 },
                          { subject: "Exercise", A: 60, fullMark: 100 },
                          { subject: "Social", A: 75, fullMark: 100 },
                          { subject: "Work", A: 40, fullMark: 100 },
                          { subject: "Sleep", A: 65, fullMark: 100 },
                          { subject: "Leisure", A: 85, fullMark: 100 },
                        ]}
                      >
                        <PolarGrid stroke="hsl(309 15% 35%)" />
                        <PolarAngleAxis
                          dataKey="subject"
                          stroke="hsl(309 5% 65%)"
                        />
                        <PolarRadiusAxis stroke="hsl(309 15% 45%)" />
                        <Radar
                          name="Emotional Impact"
                          dataKey="A"
                          stroke="hsl(270 70% 60%)"
                          fill="hsl(270 70% 60%)"
                          fillOpacity={0.5}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "hsl(309 50% 10%)",
                            borderColor: "hsl(309 30% 50%)",
                            borderRadius: "8px",
                            color: "hsl(309 5% 90%)",
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This visualization shows how different activities in your
                    life may be affecting your emotional state, based on
                    patterns in your journals and mood tracking.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations Card - Insights specific */}
            <Card className="border-blue-200/50 dark:border-blue-900/50">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent border-b border-blue-100/10 pb-4">
                <CardTitle className="flex items-center gap-2 text-blue-500">
                  <Lightbulb className="h-5 w-5" />
                  Personalized Recommendations
                </CardTitle>
                <CardDescription>
                  Activities that might improve your well-being
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="rounded-lg border border-blue-100/10 bg-blue-50/5 p-4">
                    <h3 className="flex items-center text-sm font-medium text-blue-500 mb-2">
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Based on your recent journals
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-blue-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-sm">
                          Try a 5-minute meditation before work
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-blue-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-sm">
                          Take a short walk during lunch breaks
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-blue-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-sm">
                          Journal about positive experiences at the end of the
                          day
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-blue-100/10 bg-blue-50/5 p-4">
                    <h3 className="flex items-center text-sm font-medium text-blue-500 mb-2">
                      <CheckCheck className="h-4 w-4 mr-2" />
                      Based on your mood patterns
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-blue-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-sm">
                          Consider doing physical activity on Thursdays
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="mr-2 mt-0.5 rounded-full bg-blue-500/20 p-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                        </div>
                        <span className="text-sm">
                          Practice mindfulness when feeling overwhelmed
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ===================== ANALYTICS TAB ===================== */}
        <TabsContent
          value="analytics"
          className="space-y-6 animate-in fade-in-50 duration-500"
        >
          {/* Distinct analytics header with different style than insights */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900 to-cyan-700 p-8 text-white shadow-lg">
            <div className="absolute inset-0 bg-grid-white/10 bg-[size:30px_30px] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent"></div>
            <div className="relative z-10 flex flex-col gap-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="rounded-full bg-white/90 p-2 text-blue-900">
                  <LineChartIcon className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold">Detailed Analytics</h2>
              </div>
              <p className="max-w-2xl text-blue-100">
                Explore detailed statistics and visualizations about your
                journaling habits, mood patterns, and interactions with Ana.
                These analytics help you track your progress and identify
                trends.
              </p>

              <div className="mt-4 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-200" />
                  <span className="text-sm text-blue-100">
                    Data from the last 30 days
                  </span>
                </div>
                <Button
                  onClick={handleRefresh}
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white border-none"
                  disabled={refreshing}
                >
                  <RefreshCcw
                    className={cn("h-4 w-4 mr-1", refreshing && "animate-spin")}
                  />
                  Refresh Data
                </Button>
              </div>
            </div>
          </div>

          {/* Weekly Engagement Overview - Analytics specific */}
          <Card className="border border-blue-200/20 dark:border-blue-800/20 shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Weekly Engagement
              </CardTitle>
              <CardDescription>
                Your activity patterns throughout the week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyEngagementData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(209 15% 25%)"
                    />
                    <XAxis dataKey="day" stroke="hsl(209 5% 65%)" />
                    <YAxis stroke="hsl(209 5% 65%)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(209 50% 10%)",
                        borderColor: "hsl(209 30% 50%)",
                        borderRadius: "8px",
                        color: "hsl(209 5% 90%)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="moods"
                      name="Mood Check-ins"
                      fill="hsl(320 100% 60%)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="journals"
                      name="Journal Entries"
                      fill="hsl(200 90% 50%)"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="chats"
                      name="Chat Sessions"
                      fill="hsl(150 80% 40%)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Metrics Grid - Analytics specific */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Journal Analytics Card */}
            <Card className="border-blue-200/30 dark:border-blue-900/30 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent pb-2">
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  Journal Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1 items-end">
                      <span className="text-sm font-medium">Total Entries</span>
                      <span className="text-lg font-bold text-blue-500">
                        {dashboardData?.activitySummary?.totalJournalEntries ||
                          0}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (dashboardData?.activitySummary?.totalJournalEntries ||
                          0) * 2
                      )}
                      className="h-2 bg-muted"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last week</span>
                      <span className="font-medium">
                        {dashboardData?.journalStats?.lastWeek || 0} entries
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">This week</span>
                      <span className="font-medium">
                        {dashboardData?.journalStats?.thisWeek || 0} entries
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg. length</span>
                      <span className="font-medium">
                        {dashboardData?.journalStats?.avgLength || 250} words
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-2 border-blue-200/30 hover:border-blue-500/50"
                  >
                    <Link to="/dashboard/journals">View All Journals</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Mood Analytics Card */}
            <Card className="border-rose-200/30 dark:border-rose-900/30 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-rose-500/10 to-transparent pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Smile className="h-5 w-5 mr-2 text-rose-500" />
                  Mood Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1 items-end">
                      <span className="text-sm font-medium">
                        Mood Check-ins
                      </span>
                      <span className="text-lg font-bold text-rose-500">
                        {dashboardData?.activitySummary?.totalMoodEntries || 0}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (dashboardData?.activitySummary?.totalMoodEntries ||
                          0) * 2
                      )}
                      className="h-2 bg-muted"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Top emotion</span>
                      <span className="font-medium">
                        {emotionData[0]?.name || "None"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last week</span>
                      <span className="font-medium">
                        {dashboardData?.moodStats?.lastWeek || 0} check-ins
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">This week</span>
                      <span className="font-medium">
                        {dashboardData?.moodStats?.thisWeek || 0} check-ins
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-2 border-rose-200/30 hover:border-rose-500/50"
                  >
                    <Link to="/dashboard/moods">View All Moods</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Chat Analytics Card */}
            <Card className="border-emerald-200/30 dark:border-emerald-900/30 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-transparent pb-2">
                <CardTitle className="flex items-center text-lg">
                  <MessageCircle className="h-5 w-5 mr-2 text-emerald-500" />
                  Chat Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1 items-end">
                      <span className="text-sm font-medium">Chat Sessions</span>
                      <span className="text-lg font-bold text-emerald-500">
                        {dashboardData?.activitySummary?.totalChatSessions || 0}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(
                        100,
                        (dashboardData?.activitySummary?.totalChatSessions ||
                          0) * 3.33
                      )}
                      className="h-2 bg-muted"
                    />
                  </div>

                  <div className="pt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Last session
                      </span>
                      <span className="font-medium">
                        {dashboardData?.recentActivity?.chats?.[0]?.date
                          ? format(
                              parseISO(
                                dashboardData.recentActivity.chats[0].date
                              ),
                              "MMM d"
                            )
                          : "None"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Avg. duration
                      </span>
                      <span className="font-medium">
                        {dashboardData?.chatStats?.avgDuration || 12} min
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Recent topics
                      </span>
                      <span className="font-medium">
                        {dashboardData?.chatStats?.topTopics?.join(", ") ||
                          "Various"}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-2 border-emerald-200/30 hover:border-emerald-500/50"
                  >
                    <Link to="/dashboard/chats">View All Chats</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Goal Progress & Distribution - Analytics specific */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goal Progress Card */}
            <Card className="border-green-200/30 dark:border-green-900/30 shadow-md">
              <CardHeader className="bg-gradient-to-r from-green-500/10 to-transparent">
                <CardTitle className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                  Goal Progress Breakdown
                </CardTitle>
                <CardDescription>
                  Detailed analysis of your personal goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Completion Rate
                    </p>
                    <p className="text-3xl font-bold text-green-500">
                      {dashboardData?.goalProgress?.completionRate
                        ? `${Math.round(
                            dashboardData.goalProgress.completionRate
                          )}%`
                        : "0%"}
                    </p>
                  </div>
                  <div className="h-24 w-24">
                    <div className="relative h-full w-full rounded-full">
                      <svg className="h-full w-full" viewBox="0 0 100 100">
                        <circle
                          className="stroke-muted"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="10"
                          fill="none"
                        />
                        <circle
                          className="stroke-green-500 transition-all duration-300 ease-in-out"
                          cx="50"
                          cy="50"
                          r="40"
                          strokeWidth="10"
                          fill="none"
                          strokeDasharray={`${
                            dashboardData?.goalProgress?.completionRate || 0
                          } 100`}
                          strokeDashoffset="25"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg bg-green-50/5 border border-green-200/20 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      Completed
                    </p>
                    <p className="text-xl font-bold text-green-500">
                      {dashboardData?.goalProgress?.completedGoals || 0}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/20 border border-muted/40 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">
                      In Progress
                    </p>
                    <p className="text-xl font-bold">
                      {(dashboardData?.goalProgress?.totalGoals || 0) -
                        (dashboardData?.goalProgress?.completedGoals || 0)}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-gradient-to-r from-green-50/5 to-transparent border border-green-200/10 p-3">
                  <h4 className="text-sm font-medium mb-2">Goal Categories</h4>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Personal Development</span>
                        <span className="font-medium">60%</span>
                      </div>
                      <Progress value={60} className="h-1" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Health & Wellness</span>
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-1" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Career & Education</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-1" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Activity Correlation Chart - Analytics specific */}
            <Card className="border-indigo-200/30 dark:border-indigo-900/30 shadow-md">
              <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-transparent">
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-indigo-500" />
                  Activity Correlations
                </CardTitle>
                <CardDescription>
                  How your different activities impact each other
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        {
                          name: "Week 1",
                          Moods: 4,
                          Journals: 2,
                          Chats: 1,
                          Wellbeing: 65,
                        },
                        {
                          name: "Week 2",
                          Moods: 5,
                          Journals: 3,
                          Chats: 2,
                          Wellbeing: 68,
                        },
                        {
                          name: "Week 3",
                          Moods: 6,
                          Journals: 4,
                          Chats: 2,
                          Wellbeing: 72,
                        },
                        {
                          name: "Week 4",
                          Moods: 8,
                          Journals: 5,
                          Chats: 3,
                          Wellbeing: 78,
                        },
                      ]}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(239 15% 25%)"
                      />
                      <XAxis dataKey="name" stroke="hsl(239 5% 65%)" />
                      <YAxis yAxisId="left" stroke="hsl(239 5% 65%)" />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="hsl(239 5% 65%)"
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(239 50% 10%)",
                          borderColor: "hsl(239 30% 50%)",
                          borderRadius: "8px",
                          color: "hsl(239 5% 90%)",
                        }}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Moods"
                        stroke="hsl(320 100% 60%)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Journals"
                        stroke="hsl(200 90% 50%)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="Chats"
                        stroke="hsl(150 80% 40%)"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="Wellbeing"
                        stroke="hsl(270 70% 60%)"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DashboardPage;
