/* eslint-disable @typescript-eslint/no-unused-vars */
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, Loader, Trash2 } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import { useState } from "react";
import { useMoodStore } from "@/stores/moodStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MoodCardProps {
  id: string;
  date: string;
  emotions: string[];
  description: string;
}

export const MoodCard = ({
  id,
  date,
  emotions,
  description,
}: MoodCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteMood = useMoodStore((state) => state.deleteMood);

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

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMood(id);
      toast.success("Mood entry deleted successfully");
    } catch (error) {
      toast.error("Failed to delete mood entry. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary/50 relative group">
        {/* Delete button - appears on hover */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:bg-destructive/10"
            onClick={handleDeleteClick}
          >
            <Trash2 size={16} />
          </Button>
        </div>

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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Mood Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this mood entry? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className={cn(isDeleting && "opacity-70")}
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default MoodCard;
