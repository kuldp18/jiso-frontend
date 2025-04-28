import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Target } from "lucide-react";

interface GoalProgressCardProps {
  totalGoals: number;
  completedGoals: number;
  completionRate: number;
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({
  totalGoals,
  completedGoals,
  completionRate,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2 text-primary" />
              Goal Progress
            </CardTitle>
            <CardDescription>
              Track your progress toward personal goals
            </CardDescription>
          </div>
          <div className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-1 text-green-500" />
            <span className="font-medium">
              {completedGoals}/{totalGoals} Completed
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">
                {Math.round(completionRate)}%
              </span>
            </div>
            <Progress value={completionRate} />
          </div>
          {totalGoals > 0 ? (
            <div className="text-sm text-muted-foreground">
              You've completed {completedGoals} out of {totalGoals} goals.
              {completedGoals === totalGoals && totalGoals > 0
                ? " Great job! Consider setting new goals to continue your progress."
                : " Keep going!"}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              You haven't set any goals yet. Setting goals can help you track
              your progress and stay motivated.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalProgressCard;
