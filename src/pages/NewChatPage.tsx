import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader, Send } from "lucide-react";
import { toast } from "sonner";

import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleAvatar,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

// Message type definition
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
}

const NewChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! How can I help you today?",
      role: "assistant",
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus the input field when the page loads
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Calculate container height to make the chat fill the available space
  useEffect(() => {
    const updateContainerHeight = () => {
      if (containerRef.current) {
        const viewportHeight = window.innerHeight;
        const containerTop = containerRef.current.getBoundingClientRect().top;
        // Subtract a bit more for padding
        containerRef.current.style.height = `${
          viewportHeight - containerTop - 30
        }px`;
      }
    };

    updateContainerHeight();
    window.addEventListener("resize", updateContainerHeight);
    return () => window.removeEventListener("resize", updateContainerHeight);
  }, []);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const trimmedInput = userInput.trim();
    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, content: trimmedInput, role: "user" },
    ]);

    setUserInput("");
    setIsSubmitting(true);

    try {
      // Simulate API call to create a new chat
      // In a real implementation, you would call your backend API here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Add temporary loading message
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          content: "",
          role: "assistant",
          isLoading: true,
        },
      ]);

      // Simulate receiving a chat ID from the backend
      const newChatId = `chat-${Date.now()}`;

      // In a real implementation, after creating the chat successfully,
      // navigate to the specific chat page
      setTimeout(() => {
        navigate(`/dashboard/chats/${newChatId}`);
      }, 1500);
    } catch (error) {
      toast.error("Failed to create new chat. Please try again.");
      // Remove the loading message
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== assistantMessageId)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-hidden rounded-lg border border-border"
    >
      {/* Header */}
      <div className="border-b border-border p-4">
        <h1 className="text-xl font-semibold">New Chat</h1>
        <p className="text-sm text-muted-foreground">
          Start a new chat with Ana
        </p>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        <ChatMessageList smooth>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.role === "user" ? "sent" : "received"}
            >
              {message.role === "assistant" && (
                <ChatBubbleAvatar fallback="AI" />
              )}
              <ChatBubbleMessage
                variant={message.role === "user" ? "sent" : "received"}
                isLoading={message.isLoading}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
        </ChatMessageList>
      </div>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card">
        <div className="flex gap-2 items-end">
          <ChatInput
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={isSubmitting}
            className="min-h-[60px] flex-1"
          />
          <Button
            onClick={handleSubmit}
            disabled={!userInput.trim() || isSubmitting}
            size="icon"
            className="h-[60px] w-[60px] shrink-0 p-0"
          >
            {isSubmitting ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Send />
            )}
          </Button>
        </div>
        <div className="mt-2 px-2">
          <p className="text-xs text-muted-foreground">
            Ana is designed to provide support and suggestions. For immediate
            assistance with serious concerns, please contact a mental health
            professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewChatPage;
