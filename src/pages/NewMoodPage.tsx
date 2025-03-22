import { useState, useEffect } from "react";
import { useMoodStore } from "@/stores/moodStore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  Smile,
  Frown,
  Meh,
  Heart,
  Star,
  AlertTriangle,
  ThumbsUp,
  Loader,
  Sun,
  Cloud,
  CloudRain,
  Zap,
  Sparkles,
  Music,
  Coffee,
  BookOpen,
  Film,
  Moon,
  Award,
  Bookmark,
  Flame,
  Wind,
  Droplets,
  Dumbbell,
  PenTool,
  Lightbulb,
  BrainCircuit,
  Infinity as InfinityIcon,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { JSX } from "react";

// Define the emotion categories and their emotions - easily expandable
const emotionCategories = [
  {
    name: "Happy",
    icon: <Smile className="h-8 w-8" />,
    emotions: [
      { name: "Joyful", icon: <Sun className="h-5 w-5" /> },
      { name: "Content", icon: <Coffee className="h-5 w-5" /> },
      { name: "Grateful", icon: <Heart className="h-5 w-5" /> },
      { name: "Proud", icon: <Award className="h-5 w-5" /> },
      {
        name: "Excited",
        icon: <Sparkles className="h-5 w-5" />,
      },
      { name: "Hopeful", icon: <Star className="h-5 w-5" /> },
      { name: "Inspired", icon: <Music className="h-5 w-5" /> },
      { name: "Relaxed", icon: <BookOpen className="h-5 w-5" /> },
      {
        name: "Energetic",
        icon: <Flame className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Sad",
    icon: <Frown className="h-8 w-8" />,
    emotions: [
      {
        name: "Disappointed",
        icon: <CloudRain className="h-5 w-5" />,
      },
      {
        name: "Hurt",
        icon: <AlertTriangle className="h-5 w-5" />,
      },
      { name: "Lonely", icon: <Moon className="h-5 w-5" /> },
      { name: "Grief", icon: <Cloud className="h-5 w-5" /> },
      {
        name: "Melancholic",
        icon: <Film className="h-5 w-5" />,
      },
      {
        name: "Regretful",
        icon: <Bookmark className="h-5 w-5" />,
      },
      { name: "Tearful", icon: <Droplets className="h-5 w-5" /> },
    ],
  },
  {
    name: "Neutral",
    icon: <Meh className="h-8 w-8" />,
    emotions: [
      { name: "Calm", icon: <Coffee className="h-5 w-5" /> },
      { name: "Focused", icon: <Zap className="h-5 w-5" /> },
      {
        name: "Contemplative",
        icon: <BookOpen className="h-5 w-5" />,
      },
      { name: "Reserved", icon: <Bookmark className="h-5 w-5" /> },
      { name: "Detached", icon: <Wind className="h-5 w-5" /> },
      {
        name: "Philosophical",
        icon: <BrainCircuit className="h-5 w-5" />,
      },
    ],
  },
  {
    name: "Confident",
    icon: <ThumbsUp className="h-8 w-8" />,
    emotions: [
      {
        name: "Accomplished",
        icon: <Award className="h-5 w-5" />,
      },
      { name: "Energetic", icon: <Zap className="h-5 w-5" /> },
      { name: "Brave", icon: <Star className="h-5 w-5" /> },
      {
        name: "Productive",
        icon: <Sparkles className="h-5 w-5" />,
      },
      { name: "Strong", icon: <Dumbbell className="h-5 w-5" /> },
      {
        name: "Creative",
        icon: <PenTool className="h-5 w-5" />,
      },
      {
        name: "Brilliant",
        icon: <Lightbulb className="h-5 w-5" />,
      },
      {
        name: "Unstoppable",
        icon: <InfinityIcon className="h-5 w-5" />,
      },
    ],
  },
];

const MAX_DESCRIPTION_LENGTH = 250;

// Create a map of all emotions for easy lookup
const allEmotions = emotionCategories.reduce((acc, category) => {
  category.emotions.forEach((emotion) => {
    acc[emotion.name] = emotion.icon;
  });
  return acc;
}, {} as Record<string, JSX.Element>);

const NewMoodPage = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const { createMoodEntry, isLoading } = useMoodStore();
  const [progressValue, setProgressValue] = useState(33);

  // Reset selection when going back to step 1
  useEffect(() => {
    if (step === 1) {
      setSelectedCategory(null);
      setProgressValue(33);
    } else if (step === 2) {
      setProgressValue(66);
    } else if (step === 3) {
      setProgressValue(100);
    }
  }, [step]);

  const handleCategorySelect = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setStep(2);
  };

  const handleEmotionToggle = (emotion: string) => {
    if (selectedEmotions.includes(emotion)) {
      setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
    } else {
      setSelectedEmotions([...selectedEmotions, emotion]);
    }
  };

  const handleRemoveEmotion = (emotion: string) => {
    setSelectedEmotions(selectedEmotions.filter((e) => e !== emotion));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    if (value.length <= MAX_DESCRIPTION_LENGTH) {
      setDescription(value);
    }
  };

  const handleSubmit = async () => {
    if (selectedEmotions.length === 0) {
      toast.error("Please select at least one emotion");
      return;
    }

    try {
      await createMoodEntry({
        emotions: selectedEmotions,
        description: description.trim() || undefined,
      });

      toast.success("Mood logged successfully!");
      // Reset form
      setStep(1);
      setSelectedCategory(null);
      setSelectedEmotions([]);
      setDescription("");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to log your mood. Please try again.");
    }
  };

  // Navigate to a specific step with validation
  const navigateToStep = (targetStep: number) => {
    // Can't go to step 3 without emotions
    if (targetStep === 3 && selectedEmotions.length === 0) {
      toast.error("Please select at least one emotion");
      return;
    }

    setStep(targetStep);
  };

  // Render selected emotions chip list with remove button
  const renderSelectedEmotions = () => {
    if (selectedEmotions.length === 0) return null;

    return (
      <div className="mb-4 p-3 bg-background/30 backdrop-blur-sm rounded-lg border border-gray-200/30">
        <h3 className="text-sm font-medium mb-2">Selected emotions:</h3>
        <div className="flex flex-wrap gap-2">
          {selectedEmotions.map((emotion) => (
            <div
              key={emotion}
              className="bg-primary/20 rounded-full px-3 py-1 text-sm font-medium flex items-center gap-1.5 text-foreground group"
            >
              <span className="flex items-center gap-1.5">
                <span className="scale-90">{allEmotions[emotion]}</span>
                {emotion}
              </span>
              <button
                onClick={() => handleRemoveEmotion(emotion)}
                className="rounded-full hover:bg-primary/30 p-0.5 transition-colors"
                aria-label={`Remove ${emotion}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">How are you feeling today?</h2>
          <p className="text-muted-foreground">
            Select a category to explore specific emotions
          </p>

          {renderSelectedEmotions()}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {emotionCategories.map((category) => (
              <button
                key={category.name}
                onClick={() => handleCategorySelect(category.name)}
                className={cn(
                  "flex flex-col items-center justify-center p-6 rounded-xl border",
                  "bg-gradient-to-br from-pink-500/70 to-primary/40 backdrop-blur-sm shadow-md cursor-pointer",
                  "transition-all transform hover:scale-105 hover:shadow-lg hover:from-pink-500/80 hover:to-primary/50",
                  "border-primary/20 text-foreground"
                )}
              >
                <div className="mb-3 p-3 bg-background/50 rounded-full">
                  {category.icon}
                </div>
                <span className="font-medium">{category.name}</span>
              </button>
            ))}
          </div>

          {selectedEmotions.length > 0 && (
            <div className="flex justify-end">
              <Button
                onClick={() => navigateToStep(3)}
                className="flex gap-2 rounded-sm"
              >
                Skip to Details <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </div>
      );
    }

    if (step === 2) {
      const category = emotionCategories.find(
        (c) => c.name === selectedCategory
      );

      return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">
            What kind of{" "}
            <em className="text-pink-300">{selectedCategory?.toLowerCase()}</em>{" "}
            are you feeling?
          </h2>
          <p className="text-muted-foreground">
            Select all that apply (you can choose multiple)
          </p>

          {renderSelectedEmotions()}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {category?.emotions.map((emotion) => {
              const isSelected = selectedEmotions.includes(emotion.name);
              return (
                <button
                  key={emotion.name}
                  onClick={() => handleEmotionToggle(emotion.name)}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border transition-all",
                    "backdrop-blur-sm cursor-pointer",
                    isSelected
                      ? `bg-primary/30 border-primary/50 text-foreground shadow-md`
                      : "bg-background/40 hover:bg-primary/10 border-gray-200/30 hover:shadow-md"
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-full",
                      isSelected ? "bg-primary/30" : "bg-background/80"
                    )}
                  >
                    {emotion.icon}
                  </div>
                  <span>{emotion.name}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigateToStep(1)}
              className="border-gray-200/50 bg-background/50 backdrop-blur-sm flex items-center gap-1"
            >
              <ChevronLeft size={16} /> Back
            </Button>

            <Button
              onClick={() => navigateToStep(3)}
              className="flex gap-2 text-primary-foreground rounded-sm"
              disabled={selectedEmotions.length === 0}
            >
              Continue
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Add more details (optional)</h2>

        <div className="bg-background/20 backdrop-blur-sm p-5 rounded-lg border border-gray-200/30 shadow-sm">
          <h3 className="font-medium mb-3">Selected emotions:</h3>
          <div className="flex flex-wrap gap-2">
            {selectedEmotions.map((emotion) => (
              <div
                key={emotion}
                className="bg-primary/30 rounded-full px-3 py-1.5 text-sm font-medium flex items-center gap-1.5 text-foreground"
              >
                <span className="scale-90">{allEmotions[emotion]}</span>
                <span>{emotion}</span>
                <button
                  onClick={() => handleRemoveEmotion(emotion)}
                  className="rounded-full hover:bg-primary/50 p-0.5 transition-colors ml-1"
                  aria-label={`Remove ${emotion}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <label className="text-sm font-medium">
              Would you like to add a brief description? (optional)
            </label>
            <span className="text-xs text-muted-foreground">
              {description.length}/{MAX_DESCRIPTION_LENGTH}
            </span>
          </div>
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Describe your feelings or what caused them..."
            className="min-h-[120px] bg-background/30 backdrop-blur-sm border-gray-200/50"
            maxLength={MAX_DESCRIPTION_LENGTH}
          />
        </div>

        <div className="pt-4 flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigateToStep(selectedCategory ? 2 : 1)}
            className="border-gray-200/50 bg-background/50 backdrop-blur-sm flex items-center gap-1 rounded-sm"
          >
            <ChevronLeft size={16} /> Back
          </Button>

          <Button
            onClick={handleSubmit}
            className="flex items-center text-primary-foreground px-4 rounded-sm"
            disabled={isLoading || selectedEmotions.length === 0}
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Mood Tracker</h1>
        <p className="text-muted-foreground">
          Track your emotions to better understand your mental wellbeing
        </p>
      </div>

      {/* Progress bar using shadcn UI component */}
      <div className="mb-8 space-y-4">
        <Progress value={progressValue} className="h-3" />

        {/* Step labels */}
        <div className="flex justify-between mt-2 text-xs">
          <button
            onClick={() => navigateToStep(1)}
            className={cn(
              "font-medium",
              step === 1
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Select Category
          </button>
          <button
            onClick={() => navigateToStep(2)}
            className={cn(
              "font-medium",
              step === 2
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            disabled={!selectedCategory}
          >
            Choose Emotions
          </button>
          <button
            onClick={() => navigateToStep(3)}
            className={cn(
              "font-medium",
              step === 3
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
            disabled={selectedEmotions.length === 0}
          >
            Add Details
          </button>
        </div>
      </div>

      <div className="bg-background/10 backdrop-blur-md border border-gray-200/30 rounded-xl p-6 shadow-sm">
        {renderContent()}
      </div>
    </div>
  );
};

export default NewMoodPage;
