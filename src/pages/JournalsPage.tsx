import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useJournalStore } from "@/stores/journalStore";
import { JournalEntry } from "@/types/journal.types";
import { CalendarIcon, Loader, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { JournalCard } from "@/components/app";

const JournalsPage = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);

  // Get journal entries from store
  const { journalEntries, fetchJournalEntries, isLoading, error } =
    useJournalStore();

  // Add handlers for filtering by emotion and tag
  const handleFilterByEmotion = (emotion: string) => {
    setSearchQuery(emotion);
  };

  const handleFilterByTag = (tag: string) => {
    setSearchQuery(`#${tag}`);
  };

  // Fetch journal entries on component mount
  useEffect(() => {
    fetchJournalEntries();
  }, [fetchJournalEntries]);

  // Filter entries based on search and date
  useEffect(() => {
    let filtered = [...journalEntries];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      // Check if searching for a tag (has # prefix)
      const isTagSearch = query.startsWith("#");
      const normalizedQuery = isTagSearch ? query.substring(1) : query;

      filtered = filtered.filter((entry) => {
        // If it's a tag search, only search in tags
        if (isTagSearch) {
          return (
            entry.tags &&
            entry.tags.some((tag) =>
              tag.toLowerCase().includes(normalizedQuery)
            )
          );
        }

        // Otherwise search in all fields
        return (
          // Search in entry content
          entry.entry.toLowerCase().includes(query) ||
          // Search in emotions
          (entry.emotions &&
            entry.emotions.some((emotion) =>
              emotion.toLowerCase().includes(query)
            )) ||
          // Search in tags
          (entry.tags &&
            entry.tags.some((tag) => tag.toLowerCase().includes(query)))
        );
      });
    }

    // Filter by date
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.createdAt);
        return format(entryDate, "yyyy-MM-dd") === dateStr;
      });
    }

    setFilteredEntries(filtered);
  }, [journalEntries, searchQuery, selectedDate]);

  // Handle clearing filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Your Journal Entries</h1>
        <Link to="/dashboard/journals/create">
          <Button className="w-full sm:w-auto">New Journal</Button>
        </Link>
      </div>

      {/* Search and filter controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search entries, emotions, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full sm:w-auto justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Filter by date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {(searchQuery || selectedDate) && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="w-full sm:w-auto"
          >
            Clear filters
          </Button>
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Loading your journal entries...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="bg-destructive/10 p-4 rounded-lg text-center">
          <p className="text-destructive">Failed to load journal entries</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => fetchJournalEntries()}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && filteredEntries.length === 0 && (
        <div className="text-center py-10 border border-dashed rounded-lg">
          {journalEntries.length === 0 ? (
            <>
              <p className="text-muted-foreground mb-4">
                You haven't written any journal entries yet
              </p>
              <Link to="/dashboard/journals/create">
                <Button>Write Your First Journal</Button>
              </Link>
            </>
          ) : (
            <>
              <p className="text-muted-foreground">
                No entries match your filters
              </p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear all filters
              </Button>
            </>
          )}
        </div>
      )}

      {/* Journal entries grid - responsive for different screen sizes */}
      {!isLoading && !error && filteredEntries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.map((entry) => (
            <div key={entry._id} className="w-full sm:w-full">
              <JournalCard
                id={entry._id}
                entry={entry.entry}
                createdAt={entry.createdAt}
                updatedAt={entry.updatedAt}
                emotions={entry.emotions}
                tags={entry.tags}
                onFilterByEmotion={handleFilterByEmotion}
                onFilterByTag={handleFilterByTag}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalsPage;
