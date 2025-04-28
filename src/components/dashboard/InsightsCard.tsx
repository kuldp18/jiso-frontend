import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Sparkles, Calendar, Brain } from "lucide-react";
import { format, parseISO } from "date-fns";

interface InsightItem {
  _id?: string;
  date: string;
  insight: string;
  description?: string;
}

interface SuggestionItem {
  _id?: string;
  date: string;
  suggestion: string;
  description?: string;
}

interface InsightsCardProps {
  weeklyInsights: InsightItem[];
  monthlyInsights: InsightItem[];
  suggestions: SuggestionItem[];
}

const InsightsCard: React.FC<InsightsCardProps> = ({
  weeklyInsights,
  monthlyInsights,
  suggestions,
}) => {
  const [activeInsightTab, setActiveInsightTab] = useState("weekly");

  const formatDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), "PPP");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return "Unknown date";
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
      <Lightbulb className="h-12 w-12 mb-4" />
      <p className="text-center">
        No insights available yet. Continue using Jiso by journaling, tracking
        moods, and chatting with Ana to receive personalized insights.
      </p>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-primary" />
          AI-Generated Insights
        </CardTitle>
        <CardDescription>
          Personalized insights and suggestions based on your activity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs value={activeInsightTab} onValueChange={setActiveInsightTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Monthly
            </TabsTrigger>
            <TabsTrigger value="suggestions" className="flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              Suggestions
            </TabsTrigger>
          </TabsList>

          {/* Weekly Insights */}
          <TabsContent value="weekly" className="mt-4 space-y-4">
            {weeklyInsights && weeklyInsights.length > 0
              ? weeklyInsights.map((insight, index) => (
                  <div
                    key={insight._id || index}
                    className="space-y-2 pb-4 border-b last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                        <span>{insight.insight}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(insight.date)}
                      </span>
                    </div>
                    {insight.description && (
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                    )}
                  </div>
                ))
              : renderEmptyState()}
          </TabsContent>

          {/* Monthly Insights */}
          <TabsContent value="monthly" className="mt-4 space-y-4">
            {monthlyInsights && monthlyInsights.length > 0
              ? monthlyInsights.map((insight, index) => (
                  <div
                    key={insight._id || index}
                    className="space-y-2 pb-4 border-b last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium flex items-center">
                        <Sparkles className="h-4 w-4 mr-2 text-purple-500" />
                        <span>{insight.insight}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(insight.date)}
                      </span>
                    </div>
                    {insight.description && (
                      <p className="text-sm text-muted-foreground">
                        {insight.description}
                      </p>
                    )}
                  </div>
                ))
              : renderEmptyState()}
          </TabsContent>

          {/* Suggestions */}
          <TabsContent value="suggestions" className="mt-4 space-y-4">
            {suggestions && suggestions.length > 0
              ? suggestions.map((suggestion, index) => (
                  <div
                    key={suggestion._id || index}
                    className="space-y-2 pb-4 border-b last:border-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2 text-blue-500" />
                        <span>{suggestion.suggestion}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(suggestion.date)}
                      </span>
                    </div>
                    {suggestion.description && (
                      <p className="text-sm text-muted-foreground">
                        {suggestion.description}
                      </p>
                    )}
                  </div>
                ))
              : renderEmptyState()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InsightsCard;
