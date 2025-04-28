import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Smile, ArrowRight, PlusCircle } from "lucide-react";

interface MoodSummaryCardProps {
  recentMoods: Array<{
    _id: string;
    emotions: string[];
    createdAt: string;
  }>;
  totalEntries: number;
}

const MoodSummaryCard: React.FC<MoodSummaryCardProps> = ({
  recentMoods,
  totalEntries,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Smile className="h-5 w-5 mr-2 text-yellow-500" />
          Mood Summary
        </CardTitle>
        <CardDescription>Your emotional well-being at a glance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Total Check-ins
            </span>
            <span className="font-medium">{totalEntries}</span>
          </div>

          {recentMoods && recentMoods.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Recent Moods</h4>
              <div className="space-y-2">
                {recentMoods.slice(0, 3).map((mood) => (
                  <div key={mood._id} className="flex flex-wrap gap-1">
                    {mood.emotions.slice(0, 4).map((emotion, i) => (
                      <Badge key={i} variant="outline" className="bg-muted/50">
                        {emotion}
                      </Badge>
                    ))}
                    {mood.emotions.length > 4 && (
                      <Badge variant="outline" className="bg-muted/50">
                        +{mood.emotions.length - 4} more
                      </Badge>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-sm px-0"
                >
                  <Link
                    to="/moods"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    View All <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-sm px-0"
                >
                  <Link
                    to="/mood/new"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    New Entry <PlusCircle className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Smile className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                No mood entries yet
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/mood/new">Record Your Mood</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodSummaryCard;
