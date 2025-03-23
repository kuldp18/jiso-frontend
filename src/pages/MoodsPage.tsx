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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Your Mood Entries</h1>
        <Link to="/dashboard/moods/create">
          <Button className="w-full sm:w-auto">New Entry</Button>
        </Link>
      </div>

      {/* Search and filter controls */}
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
                {selectedDate ? format(selectedDate, "PPP") : "Filter by date"}
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

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10">
          <Loader className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">
            Loading your mood entries...
          </p>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
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

      {/* Empty state */}
      {!isLoading && !error && filteredEntries.length === 0 && (
        <div className="text-center py-10 border border-dashed rounded-lg">
          {moodEntries.length === 0 ? (
            <>
              <p className="text-muted-foreground mb-4">
                You haven't logged any moods yet
              </p>
              <Link to="/dashboard/moods/create">
                <Button>Log Your First Mood</Button>
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

      {/* Mood entries grid - responsive for different screen sizes */}
      {!isLoading && !error && filteredEntries.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredEntries.map((entry) => (
            <MoodCard
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
