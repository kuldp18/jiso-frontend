import { useEffect, useState } from "react";
import { MoodCard } from "@/components/app";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useMoodStore } from "@/stores/moodStore";
import { MoodEntry } from "@/types/mood.types";
import { CalendarIcon, Loader, Search } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const MoodsPage = () => {
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [filteredEntries, setFilteredEntries] = useState<MoodEntry[]>([]);

  // Get mood entries from store
  const { moodEntries, fetchMoodEntries, isLoading, error } = useMoodStore();

  // Fetch mood entries on component mount
  useEffect(() => {
    fetchMoodEntries();
  }, [fetchMoodEntries]);

  // Filter entries based on search and date
  useEffect(() => {
    let filtered = [...moodEntries];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (entry) =>
          // Search in emotions
          entry.emotions.some((emotion) =>
            emotion.toLowerCase().includes(query)
          ) ||
          // Search in description
          (entry.description && entry.description.toLowerCase().includes(query))
      );
    }

    // Filter by date
    if (selectedDate) {
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      filtered = filtered.filter((entry) => {
        const entryDate = new Date(entry.createdAt || "");
        return format(entryDate, "yyyy-MM-dd") === dateStr;
      });
    }

    setFilteredEntries(filtered);
  }, [moodEntries, searchQuery, selectedDate]);

  // Handle clearing filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDate(undefined);
  };

  // Check if there are actual server errors (not just 404 no moods found)
  const hasServerError = error && error !== "No mood entries found";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Your Mood Entries</h1>
        <Link to="/dashboard/moods/create">
          <Button className="w-full sm:w-auto">New Entry</Button>
        </Link>
      </div>

      {/* Only show search and filters if there are entries */}
      {moodEntries.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search emotions or descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={selectedDate ? "default" : "outline"}
                  className={cn(
                    "justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "PPP")
                    : "Filter by date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {(searchQuery || selectedDate) && (
              <Button variant="ghost" onClick={clearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Loading your mood entries...
          </p>
        </div>
      )}

      {/* Actual server error state (not just empty moods) */}
      {hasServerError && !isLoading && (
        <div className="bg-destructive/10 p-4 rounded-lg text-center">
          <p className="text-destructive">Failed to load mood entries</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => fetchMoodEntries()}
          >
            Try again
          </Button>
        </div>
      )}

      {/* Empty state - no moods created yet */}
      {!isLoading && !hasServerError && moodEntries.length === 0 && (
        <div className="text-center py-12 border border-dashed rounded-lg flex flex-col items-center">
          <h3 className="text-lg font-medium mb-2">No mood entries yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md">
            Start tracking your emotions by creating your first mood entry. It's
            a great way to understand your emotional patterns.
          </p>
          <Link to="/dashboard/moods/create">
            <Button size="lg">Create Your First Mood Entry</Button>
          </Link>
        </div>
      )}

      {/* No results from filters */}
      {!isLoading &&
        !hasServerError &&
        moodEntries.length > 0 &&
        filteredEntries.length === 0 && (
          <div className="text-center py-10 border border-dashed rounded-lg">
            <p className="text-muted-foreground">
              No entries match your filters
            </p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear all filters
            </Button>
          </div>
        )}

      {/* Mood entries grid - responsive for different screen sizes */}
      {!isLoading && !hasServerError && filteredEntries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEntries.map((entry) => (
            <MoodCard
              id={entry._id || ""}
              key={entry._id}
              date={entry.createdAt || "Unknown date"}
              emotions={entry.emotions}
              description={entry.description || ""}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoodsPage;
