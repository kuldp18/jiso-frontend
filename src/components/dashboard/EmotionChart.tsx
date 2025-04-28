import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Smile } from "lucide-react";

interface EmotionChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  description?: string;
}

// Color palette for the chart
const COLORS = [
  "#0088FE", // Blue
  "#00C49F", // Green
  "#FFBB28", // Yellow
  "#FF8042", // Orange
  "#A020F0", // Purple
  "#FFC0CB", // Pink
  "#C71585", // Medium violet red
  "#00FFFF", // Cyan
  "#FF6347", // Tomato
  "#32CD32", // Lime green
];

const EmotionChart: React.FC<EmotionChartProps> = ({
  data,
  title = "Emotion Distribution",
  description = "Breakdown of your most frequent emotions",
}) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center h-[300px]">
          <Smile className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-center">
            No emotion data available yet. Continue recording your moods to see
            insights.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort data by value in descending order
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // If there are more than 8 emotions, group the less frequent ones as "Others"
  const processedData =
    sortedData.length > 8
      ? [
          ...sortedData.slice(0, 7),
          {
            name: "Others",
            value: sortedData
              .slice(7)
              .reduce((sum, item) => sum + item.value, 0),
          },
        ]
      : sortedData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`${value} occurrences`, ""]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionChart;
