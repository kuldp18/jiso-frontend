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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CalendarIcon,
  ClockIcon,
  Loader,
  Trash2,
  Edit,
  X,
  History,
} from "lucide-react";
import { format, parseISO, isValid, formatDistanceToNow } from "date-fns";
import { useState, KeyboardEvent, ChangeEvent } from "react";
import { useMoodStore } from "@/stores/moodStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MoodCardProps {
  id: string;
  date: string;
  emotions: string[];
  description: string;
  updatedAt?: string;
}

export const MoodCard = ({
  id,
  date,
  emotions,
  description,
  updatedAt,
}: MoodCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editedEmotions, setEditedEmotions] = useState<string[]>(emotions);
  const [editedDescription, setEditedDescription] = useState(description);
  const [emotionInput, setEmotionInput] = useState("");
  const [isEditLoading, setIsEditLoading] = useState(false);

  const deleteMood = useMoodStore((state) => state.deleteMood);
  const editMood = useMoodStore((state) => state.editMood);

  // Parse creation date
  let createdDate = "Unknown date";
  let createdTime = "Unknown time";
  let createdRelativeText = "";

  // Parse update date (if available)
  let updatedDate = "";
  let updatedTime = "";
  let updatedRelativeText = "";
  let wasUpdated = false;

  // Parse dates
  try {
    // Handle creation date
    let parsedCreationDate;
    if (date.includes(",") && date.match(/AM|PM|am|pm/)) {
      parsedCreationDate = new Date(date);
    } else {
      parsedCreationDate = parseISO(date);
    }

    if (isValid(parsedCreationDate)) {
      createdDate = format(parsedCreationDate, "MMM d, yyyy");
      createdTime = format(parsedCreationDate, "h:mm a");
      createdRelativeText = formatDistanceToNow(parsedCreationDate, {
        addSuffix: true,
      });
    }

    // Handle updated date if available
    if (updatedAt) {
      const parsedUpdateDate = parseISO(updatedAt);
      if (isValid(parsedUpdateDate)) {
        wasUpdated = true;
        updatedDate = format(parsedUpdateDate, "MMM d, yyyy");
        updatedTime = format(parsedUpdateDate, "h:mm a");
        updatedRelativeText = formatDistanceToNow(parsedUpdateDate, {
          addSuffix: true,
        });
      }
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

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setEditedEmotions([...emotions]);
    setEditedDescription(description);
    setShowEditDialog(true);
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

  const handleSaveEdit = async () => {
    if (editedEmotions.length === 0) {
      toast.error("Please add at least one emotion");
      return;
    }

    setIsEditLoading(true);
    try {
      await editMood(id, {
        emotions: editedEmotions,
        description: editedDescription,
      });
      toast.success("Mood entry updated successfully");
      setShowEditDialog(false);
    } catch (error) {
      toast.error("Failed to update mood entry. Please try again.");
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleEmotionInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmotionInput(e.target.value);
  };

  const handleEmotionKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addEmotion();
    }
  };

  const addEmotion = () => {
    const trimmedEmotion = emotionInput.trim();
    if (trimmedEmotion && !editedEmotions.includes(trimmedEmotion)) {
      setEditedEmotions([...editedEmotions, trimmedEmotion]);
      setEmotionInput("");
    }
  };

  const removeEmotion = (emotionToRemove: string) => {
    setEditedEmotions(
      editedEmotions.filter((emotion) => emotion !== emotionToRemove)
    );
  };

  return (
    <>
      <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary/50 relative group">
        {/* Action buttons - appear on hover */}
        <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:bg-primary/10"
            onClick={handleEditClick}
          >
            <Edit size={16} />
          </Button>
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
            {/* Show date - either creation or update date */}
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{wasUpdated ? updatedDate : createdDate}</span>
            </div>

            {/* Show time with appropriate icon */}
            {wasUpdated ? (
              <div className="flex items-center">
                <History className="h-4 w-4 mr-1" />
                <span title={`Updated on ${updatedDate} at ${updatedTime}`}>
                  Updated {updatedRelativeText}
                </span>
              </div>
            ) : (
              <div className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span title={`Created on ${createdDate} at ${createdTime}`}>
                  {createdRelativeText}
                </span>
              </div>
            )}
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
              </DialogHeader>

              <div className="mt-2 space-y-4">
                {/* Time information - cleaner presentation */}
                <div className="bg-muted/40 rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">{createdDate}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {createdTime}
                    </span>
                  </div>

                  {/* Only show update info if available */}
                  {wasUpdated && (
                    <div className="pt-2 mt-2 border-t border-border">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <History className="h-4 w-4 mr-2 text-primary/70" />
                        <span>Updated {updatedRelativeText}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Emotions section */}
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <span className="mr-1">Emotions</span>
                    <span className="text-muted-foreground text-xs">
                      ({emotions.length})
                    </span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {emotions.map((emotion, index) => (
                      <Badge key={index} variant="secondary">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Description section - if available */}
                {description && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Description</h4>
                    <div className="bg-muted/30 rounded-md p-3 max-h-60 overflow-y-auto">
                      <p className="text-sm text-foreground/90 whitespace-pre-line break-words">
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Mood Entry</DialogTitle>
            <DialogDescription className="flex flex-col space-y-1 text-sm pt-1">
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>Created on {createdDate}</span>
              </div>
              {wasUpdated && (
                <div className="flex items-center text-xs">
                  <History className="h-3 w-3 mr-1" />
                  <span>Last updated {updatedRelativeText}</span>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-4">
            {/* Emotions edit section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Emotions</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {editedEmotions.map((emotion, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {emotion}
                    <button
                      onClick={() => removeEmotion(emotion)}
                      className="ml-1 rounded-full hover:bg-secondary/80 p-0.5"
                      aria-label={`Remove ${emotion}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  value={emotionInput}
                  onChange={handleEmotionInputChange}
                  onKeyDown={handleEmotionKeyDown}
                  onBlur={addEmotion}
                  placeholder="Add emotions (e.g., happy, excited, calm)"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Type an emotion and press enter or comma to add it
              </p>
            </div>

            {/* Description edit section */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Description (optional)
              </label>
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Describe your feelings or what caused them..."
                className="min-h-[120px] resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isEditLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isEditLoading || editedEmotions.length === 0}
            >
              {isEditLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MoodCard;
