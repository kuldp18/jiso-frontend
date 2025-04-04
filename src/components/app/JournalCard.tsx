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
import {
  CalendarIcon,
  ClockIcon,
  TagIcon,
  HeartIcon,
  Loader2,
  Trash2,
  Edit,
  X,
} from "lucide-react";
import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";
import ReactMarkdown from "react-markdown";
import { useState, KeyboardEvent, ChangeEvent } from "react";
import { useJournalStore } from "@/stores/journalStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface JournalCardProps {
  id: string;
  entry: string;
  createdAt: string;
  updatedAt: string;
  emotions?: string[];
  tags?: string[];
  onFilterByEmotion?: (emotion: string) => void;
  onFilterByTag?: (tag: string) => void;
}

const JournalCard = ({
  id,
  entry,
  createdAt,
  updatedAt,
  emotions = [],
  tags = [],
  onFilterByEmotion,
  onFilterByTag,
}: JournalCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Edit states
  const [editedEntry, setEditedEntry] = useState(entry);
  const [editedEmotions, setEditedEmotions] = useState<string[]>([...emotions]);
  const [editedTags, setEditedTags] = useState<string[]>([...tags]);
  const [emotionInput, setEmotionInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const deleteJournal = useJournalStore((state) => state.deleteJournal);
  const editJournal = useJournalStore((state) => state.editJournal);

  // Parse dates for display
  let formattedCreatedDate = "Unknown date";
  let formattedCreatedTime = "Unknown time";
  let formattedUpdatedDate = "Unknown date";
  let formattedUpdatedTime = "Unknown time";
  let isUpdated = false;
  let timeAgo = "";

  try {
    let parsedCreatedDate;
    let parsedUpdatedDate;

    if (createdAt.includes(",") && createdAt.match(/AM|PM|am|pm/)) {
      parsedCreatedDate = new Date(createdAt);
    } else {
      parsedCreatedDate = parseISO(createdAt);
    }

    if (updatedAt.includes(",") && updatedAt.match(/AM|PM|am|pm/)) {
      parsedUpdatedDate = new Date(updatedAt);
    } else {
      parsedUpdatedDate = parseISO(updatedAt);
    }

    if (isValid(parsedCreatedDate)) {
      formattedCreatedDate = format(parsedCreatedDate, "MMM d, yyyy");
      formattedCreatedTime = format(parsedCreatedDate, "h:mm a");
      timeAgo = formatDistanceToNow(parsedCreatedDate, { addSuffix: true });
    }

    if (isValid(parsedUpdatedDate)) {
      formattedUpdatedDate = format(parsedUpdatedDate, "MMM d, yyyy");
      formattedUpdatedTime = format(parsedUpdatedDate, "h:mm a");

      // Check if updated time is different from created time
      isUpdated = updatedAt !== createdAt;

      if (isUpdated) {
        timeAgo = `Updated ${formatDistanceToNow(parsedUpdatedDate, {
          addSuffix: true,
        })}`;
      }
    }
  } catch (error) {
    console.error("Error parsing date:", error, { createdAt, updatedAt });
  }

  // Truncate entry for card view
  const maxLength = 120;
  const plainTextEntry = entry.replace(/[#*`_~[\]()]/g, ""); // Remove markdown characters for length calculation
  const isTruncated = plainTextEntry.length > maxLength;
  const truncatedEntry = isTruncated
    ? `${entry.substring(0, maxLength)}...`
    : entry;

  // Handle emotion click
  const handleEmotionClick = (emotion: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFilterByEmotion) {
      onFilterByEmotion(emotion);
    }
  };

  // Handle tag click
  const handleTagClick = (tag: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFilterByTag) {
      onFilterByTag(tag);
    }
  };

  // Handle delete functionality
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteJournal(id);
      toast.success("Journal entry deleted successfully");
    } catch (error) {
      console.error("Error deleting journal:", error);
      toast.error("Failed to delete journal entry");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // Handle edit functionality
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Reset edited values to current values
    setEditedEntry(entry);
    setEditedEmotions([...emotions]);
    setEditedTags([...tags]);
    setShowEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!editedEntry.trim()) {
      toast.error("Journal entry cannot be empty");
      return;
    }

    setIsEditing(true);
    try {
      await editJournal(id, {
        entry: editedEntry,
        emotions: editedEmotions,
        tags: editedTags,
      });
      toast.success("Journal entry updated successfully");
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating journal:", error);
      toast.error("Failed to update journal entry");
    } finally {
      setIsEditing(false);
    }
  };

  // Emotion input handlers
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

  // Tag input handlers
  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !editedTags.includes(trimmedTag)) {
      setEditedTags([...editedTags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <>
      <Card className="min-h-[320px] w-full flex flex-col relative group">
        {/* Action buttons - appear on hover */}
        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleEditClick}
            aria-label="Edit journal"
          >
            <Edit size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={handleDeleteClick}
            aria-label="Delete journal"
          >
            <Trash2 size={16} />
          </Button>
        </div>

        <CardHeader className="pb-2 flex-shrink-0">
          <div className="flex flex-col space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>
                {isUpdated ? formattedUpdatedDate : formattedCreatedDate}
              </span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              <span>
                {isUpdated ? formattedUpdatedTime : formattedCreatedTime}
              </span>
              {isUpdated && (
                <span className="ml-1.5 text-xs italic font-light">
                  (edited)
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-0 flex flex-col flex-grow">
          {/* Entry content with line clamping instead of fixed height */}
          <div className="mb-3 flex-shrink-0">
            <div className="line-clamp-3 break-words text-sm text-muted-foreground">
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-lg font-bold my-2" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-base font-semibold my-2" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-sm font-medium my-1" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc pl-5 mb-2" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal pl-5 mb-2" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-primary underline" {...props} />
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote
                      className="border-l-2 border-muted pl-3 italic my-2"
                      {...props}
                    />
                  ),
                  code: ({ node, ...props }) => (
                    <code
                      className="bg-muted px-1 py-0.5 rounded text-xs"
                      {...props}
                    />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre
                      className="bg-muted p-2 rounded overflow-x-auto my-2 text-xs"
                      {...props}
                    />
                  ),
                }}
              >
                {truncatedEntry}
              </ReactMarkdown>
            </div>
          </div>

          {/* Display both emotions and tags with distinct styles */}
          <div className="space-y-2 mb-3">
            {emotions && emotions.length > 0 && (
              <div className="flex items-start gap-1.5">
                <HeartIcon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {emotions.map((emotion, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="text-xs cursor-pointer hover:bg-secondary/80"
                      onClick={(e) => handleEmotionClick(emotion, e)}
                    >
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {tags && tags.length > 0 && (
              <div className="flex items-start gap-1.5">
                <TagIcon className="h-4 w-4 text-foreground mt-0.5 flex-shrink-0" />
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="text-xs cursor-pointer hover:bg-muted"
                      onClick={(e) => handleTagClick(tag, e)}
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="pt-2 mt-auto flex-shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full">
                View details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] md:max-w-[650px] md:min-w-[450px] p-4 sm:p-6 w-[calc(100vw-32px)] sm:w-auto mx-auto my-auto">
              <DialogHeader>
                <DialogDescription className="flex flex-col space-y-1 text-sm pt-1">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-primary" />
                    <span className="font-medium">Created:</span>
                    <span className="ml-2">{formattedCreatedDate}</span>
                    <span className="mx-1">•</span>
                    <span>{formattedCreatedTime}</span>
                  </div>

                  <div className="text-xs text-muted-foreground mt-1 italic">
                    {timeAgo}
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4 max-h-[450px] overflow-y-auto pr-2">
                <div>
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 className="text-xl font-bold my-3" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-lg font-semibold my-3" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-base font-medium my-2" {...props} />
                      ),
                      p: ({ node, ...props }) => (
                        <p className="mb-3 text-muted-foreground" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 mb-3" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 mb-3" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="mb-1 text-muted-foreground" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-primary underline" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-2 border-muted pl-3 italic my-3 text-muted-foreground"
                          {...props}
                        />
                      ),
                      code: ({ node, ...props }) => (
                        <code
                          className="bg-muted px-1 py-0.5 rounded text-sm"
                          {...props}
                        />
                      ),
                      pre: ({ node, ...props }) => (
                        <pre
                          className="bg-muted p-3 rounded overflow-x-auto my-3 text-sm"
                          {...props}
                        />
                      ),
                      hr: ({ node, ...props }) => (
                        <hr className="my-3 border-muted" {...props} />
                      ),
                    }}
                  >
                    {entry}
                  </ReactMarkdown>
                </div>

                {emotions && emotions.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <HeartIcon className="h-4 w-4 text-primary mr-1.5" />
                      Emotions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {emotions.map((emotion, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/80"
                          onClick={(e) => handleEmotionClick(emotion, e)}
                        >
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {tags && tags.length > 0 && (
                  <div className="mb-2">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <TagIcon className="h-4 w-4 text-foreground mr-1.5" />
                      Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="cursor-pointer hover:bg-muted"
                          onClick={(e) => handleTagClick(tag, e)}
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mb-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClick}
                    className="flex items-center gap-1"
                  >
                    <Edit size={14} />
                    Edit entry
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Journal Entry</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this journal entry? This action
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        <DialogContent className="sm:max-w-[600px] md:max-w-[650px] md:min-w-[450px] p-4 sm:p-6 w-[calc(100vw-32px)] sm:w-auto">
          <DialogHeader>
            <DialogDescription className="text-lg font-medium">
              Edit Journal Entry
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Journal Content</label>
              <Textarea
                value={editedEntry}
                onChange={(e) => setEditedEntry(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
                placeholder="Write your journal entry..."
              />
              <p className="text-xs text-muted-foreground">
                You can use markdown for formatting
              </p>
            </div>

            {/* Emotions input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Emotions</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editedEmotions.map((emotion) => (
                  <Badge
                    key={emotion}
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

            {/* Tags input */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {editedTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 rounded-full hover:bg-accent/50 p-0.5"
                      aria-label={`Remove ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 items-center">
                <Input
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagKeyDown}
                  onBlur={addTag}
                  placeholder="Add tags (e.g., work, family, reflection)"
                  className="flex-1"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Type a tag and press enter or comma to add it
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              disabled={isEditing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isEditing || !editedEntry.trim()}
              className={cn(isEditing && "opacity-70")}
            >
              {isEditing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

export default JournalCard;
