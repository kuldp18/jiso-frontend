export interface ChatMessage {
  sender: "user" | "ai";
  content: string;
}

export interface Chat {
  _id: string;
  userId: string;
  userContext: string;
  title: string;
  summary: string;
  summaryStatus: "pending" | "complete" | "error";
  summaryError: string | null;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
