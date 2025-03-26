/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Loader,
  Search,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChatStore } from "@/stores/chatStore";
import { Chat } from "@/types/chat.types";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const ChatsPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChats, setFilteredChats] = useState<Chat[]>([]);
  const navigate = useNavigate();

  const fetchAllChats = ChatStore((state) => state.fetchAllChats);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chatsData = await fetchAllChats();
        setChats(chatsData || []);
      } catch (error) {
        toast.error("Failed to load chats. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadChats();
  }, [fetchAllChats]);

  // Filter chats based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredChats(chats);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(query) ||
        chat.summary.toLowerCase().includes(query)
    );

    setFilteredChats(filtered);
  }, [chats, searchQuery]);

  // Get first message content for preview
  const getChatPreview = (chat: Chat) => {
    if (!chat.messages || chat.messages.length === 0) {
      return "No messages";
    }

    // Get first AI response if available, otherwise first message
    const aiMessage = chat.messages.find((msg) => msg.sender === "ai");
    const firstMessage = chat.messages[0];

    const message = aiMessage || firstMessage;
    return message.content.length > 120
      ? `${message.content.substring(0, 120)}...`
      : message.content;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffDays = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays < 7) {
        return formatDistanceToNow(date, { addSuffix: true });
      } else {
        return format(date, "MMM d, yyyy");
      }
    } catch (e) {
      return "Unknown date";
    }
  };

  const handleNewChat = () => {
    navigate("/dashboard/new-chat");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Your Conversations</h1>
        <Button
          onClick={handleNewChat}
          className="w-full sm:w-auto flex items-center gap-2"
        >
          New Chat
        </Button>
      </div>

      {/* Search control */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Loading your conversations...
          </p>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredChats.length === 0 && (
        <div className="text-center py-10">
          {searchQuery ? (
            <>
              <p className="text-muted-foreground">
                No conversations match your search
              </p>
              <Button
                variant="link"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Clear search
              </Button>
            </>
          ) : (
            <>
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No conversations yet</h3>
              <p className="mt-2 text-muted-foreground">
                Start a new conversation with Ana to get personalized support
              </p>
              <Button onClick={handleNewChat} className="mt-4">
                Start a conversation
              </Button>
            </>
          )}
        </div>
      )}

      {/* Chats grid */}
      {!isLoading && filteredChats.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChats.map((chat) => (
            <Link
              to={`/dashboard/chats/${chat._id}`}
              key={chat._id}
              className="block group"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex justify-between items-start">
                    <span className="line-clamp-1">
                      {chat.title || "Untitled Chat"}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 flex-shrink-0">
                      <Calendar className="h-3 w-3" />
                      {formatDate(chat.createdAt)}
                    </span>
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    {chat.messages?.length || 0} messages
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {getChatPreview(chat)}
                  </p>
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-xs flex items-center gap-1 text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Last updated{" "}
                      {formatDistanceToNow(new Date(chat.updatedAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <ArrowRight
                      className={cn(
                        "h-4 w-4 text-primary opacity-0 transition-opacity duration-200",
                        "group-hover:opacity-100"
                      )}
                    />
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {/* No results from search */}
      {!isLoading &&
        searchQuery &&
        filteredChats.length === 0 &&
        chats.length > 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No conversations match "{searchQuery}"
            </p>
            <Button
              variant="link"
              onClick={() => setSearchQuery("")}
              className="mt-2"
            >
              Clear search
            </Button>
          </div>
        )}
    </div>
  );
};

export default ChatsPage;
