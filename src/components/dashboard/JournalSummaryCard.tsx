import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Book, ArrowRight, PlusCircle } from "lucide-react";
import { format, parseISO } from "date-fns";

interface JournalEntry {
  _id: string;
  date: string;
  summary: string;
}

interface JournalSummaryCardProps {
  recentEntries: JournalEntry[];
  totalEntries: number;
}

const JournalSummaryCard: React.FC<JournalSummaryCardProps> = ({
  recentEntries,
  totalEntries,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Book className="h-5 w-5 mr-2 text-blue-500" />
          Journal Summary
        </CardTitle>
        <CardDescription>
          Your journaling activity and recent entries
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total Entries</span>
            <span className="font-medium">{totalEntries}</span>
          </div>

          {recentEntries && recentEntries.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Recent Entries</h4>
              <div className="space-y-3">
                {recentEntries.slice(0, 2).map((entry) => (
                  <div key={entry._id} className="space-y-1">
                    <div className="text-xs text-muted-foreground">
                      {format(parseISO(entry.date), "PPP")}
                    </div>
                    <Link
                      to={`/journals/${entry._id}`}
                      className="line-clamp-2 text-sm hover:underline"
                    >
                      {entry.summary}
                    </Link>
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
                    to="/journals"
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
                    to="/journal/new"
                    className="flex items-center text-muted-foreground hover:text-primary"
                  >
                    New Entry <PlusCircle className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Book className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                No journal entries yet
              </p>
              <Button asChild variant="outline" size="sm">
                <Link to="/journal/new">Create First Entry</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalSummaryCard;
