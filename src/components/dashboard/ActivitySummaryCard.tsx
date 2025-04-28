import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface ActivitySummaryCardProps {
  title: string;
  count: number;
  icon: ReactNode;
  linkTo: string;
}

const ActivitySummaryCard: React.FC<ActivitySummaryCardProps> = ({
  title,
  count,
  icon,
  linkTo,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
          <div className="mr-2">{icon}</div>
          <h3 className="font-medium text-sm">{title}</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">{count}</div>
        <Button asChild variant="ghost" className="p-0 h-auto" size="sm">
          <Link
            to={linkTo}
            className="flex items-center text-sm text-muted-foreground hover:text-primary"
          >
            View All <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ActivitySummaryCard;
