export interface NewJournalEntry {
  entry: string;
  emotions?: string[];
  tags?: string[];
}

export interface JournalEntry extends NewJournalEntry {
  _id: string;
  userId: string;
  summaryStatus: "pending" | "complete" | "error";
  summaryError: string | null;
  summaries: {
    small: string;
    medium: string;
    large: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}
