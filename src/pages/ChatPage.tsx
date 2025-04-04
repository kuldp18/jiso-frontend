/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader, Send, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import TherapistImage from "@/assets/therapist.png";
import ReactMarkdown from "react-markdown";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleMessage,
  ChatBubbleAvatar,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { ChatStore } from "@/stores/chatStore";
import { ChatMessage as ApiChatMessage } from "@/types/chat.types";

// Message type definition for UI rendering
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
}

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatTitle, setChatTitle] = useState("Chat");

  const fetchChat = ChatStore((state) => state.fetchChat);
  const sendMessage = ChatStore((state) => state.sendMessage);
  const isLoading = ChatStore((state) => state.isLoading);

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

  // Fetch chat data when component mounts or chatId changes
  useEffect(() => {
    if (!chatId) return;

    const loadChatData = async () => {
      try {
        await fetchChat(chatId);
        // Access the chat data directly from the store
        const chatData = ChatStore.getState().chat;

        if (chatData) {
          // Format messages for UI
          const formattedMessages: Message[] = chatData.messages.map(
            (msg: ApiChatMessage, index: number) => ({
              id: `${msg.sender}-${index}`,
              content: msg.content,
              role: msg.sender === "user" ? "user" : "assistant",
            })
          );

          setMessages(formattedMessages);
          setChatTitle(chatData.title || "Chat");
        }
      } catch (error) {
        toast.error("Failed to load chat. Please try again.");
        navigate("/dashboard/chats/new");
      }
    };

    loadChatData();
  }, [chatId, fetchChat, navigate]);

  const handleSubmit = async () => {
    if (!userInput.trim() || !chatId) return;

    const trimmedInput = userInput.trim();
    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;

    // Add user message to the UI
    setMessages((prev) => [
      ...prev,
      { id: userMessageId, content: trimmedInput, role: "user" },
    ]);

    setUserInput("");
    setIsSubmitting(true);

    try {
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

      // Send the message to the backend
      const aiResponse = await sendMessage(chatId, trimmedInput);

      // Update the assistant message with the actual response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: aiResponse ?? "", isLoading: false }
            : msg
        )
      );
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
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

  const handleBackToChats = () => {
    navigate("/dashboard/chats");
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full overflow-hidden rounded-lg border border-border"
    >
      {/* Header */}
      <div className="border-b border-border p-4 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBackToChats}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">{chatTitle}</h1>
          <p className="text-sm text-muted-foreground">Chat with Ana</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-hidden">
        {isLoading && messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          // Inside your return statement, where you render chat messages
          <ChatMessageList smooth>
            {messages.map((message) => (
              <ChatBubble
                key={message.id}
                variant={message.role === "user" ? "sent" : "received"}
              >
                {message.role === "assistant" && (
                  <ChatBubbleAvatar fallback="AI" src={TherapistImage} />
                )}
                <ChatBubbleMessage
                  variant={message.role === "user" ? "sent" : "received"}
                  isLoading={message.isLoading}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        p: ({ node, ...props }) => (
                          <p className="mb-2 last:mb-0" {...props} />
                        ),
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
                            className="bg-muted px-1.5 py-0.5 rounded text-sm"
                            {...props}
                          />
                        ),
                        pre: ({ node, ...props }) => (
                          <pre
                            className="bg-muted p-3 rounded overflow-x-auto my-2 text-sm"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
          </ChatMessageList>
        )}
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

export default ChatPage;
