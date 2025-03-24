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
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, TagIcon, HeartIcon } from "lucide-react";
import { format, parseISO, isValid } from "date-fns";
import ReactMarkdown from "react-markdown";

interface JournalCardProps {
  id: string;
  entry: string;
  createdAt: string;
  emotions?: string[];
  tags?: string[];
  onFilterByEmotion?: (emotion: string) => void;
  onFilterByTag?: (tag: string) => void;
}

const JournalCard = ({
  entry,
  createdAt,
  emotions,
  tags,
  onFilterByEmotion,
  onFilterByTag,
}: JournalCardProps) => {
  let formattedDate = "Unknown date";
  let formattedTime = "Unknown time";

  try {
    let parsedDate;

    if (createdAt.includes(",") && createdAt.match(/AM|PM|am|pm/)) {
      parsedDate = new Date(createdAt);
    } else {
      parsedDate = parseISO(createdAt);
    }

    if (isValid(parsedDate)) {
      formattedDate = format(parsedDate, "MMM d, yyyy");
      formattedTime = format(parsedDate, "h:mm a");
    }
  } catch (error) {
    console.error("Error parsing date:", error, createdAt);
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

  return (
    <Card className="min-h-[320px] w-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
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
                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
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
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  <span>{formattedTime}</span>
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
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};

export default JournalCard;
