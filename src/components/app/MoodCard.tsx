import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";

interface MoodCardProps {
  date: string;
  emotions: string[];
  description: string;
}

export const MoodCard = ({ date, emotions, description }: MoodCardProps) => {
  let formattedDate = "Unknown date";
  let formattedTime = "Unknown time";

  try {
    let parsedDate;

    if (date.includes(",") && date.match(/AM|PM|am|pm/)) {
      parsedDate = new Date(date);
    } else {
      parsedDate = parseISO(date);
    }

    if (isValid(parsedDate)) {
      formattedDate = format(parsedDate, "MMM d, yyyy");
      formattedTime = format(parsedDate, "h:mm a");
    }
  } catch (error) {
    console.error("Error parsing date:", error, date);
  }

  // Truncate description for card view
  const maxLength = 100;
  const isTruncated = description && description.length > maxLength;
  const truncatedDescription = isTruncated
    ? `${description.substring(0, maxLength)}...`
    : description;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center">
            <CalendarIcon className="h-4 w-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {emotions.map((emotion, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {emotion}
            </Badge>
          ))}
        </div>

        {description && (
          <div className="relative">
            <p className="text-sm text-muted-foreground line-clamp-2 break-words">
              {truncatedDescription}
            </p>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0 mt-auto">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full mt-2">
              View details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Mood Entry</DialogTitle>
              <DialogDescription className="flex flex-col space-y-1 text-sm pt-1">
                <div className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{formattedTime}</span>
                </div>
              </DialogDescription>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Emotions</h4>
                <div className="flex flex-wrap gap-2">
                  {emotions.map((emotion, index) => (
                    <Badge key={index} variant="secondary">
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>

              {description && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Description</h4>
                  <div className="max-h-60 overflow-y-auto pr-1">
                    <p className="text-sm text-muted-foreground whitespace-pre-line break-words break-all">
                      {description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default MoodCard;
