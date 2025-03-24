import { Separator } from "@/components/ui/separator";
import { BlockquoteToolbar } from "@/components/toolbars/blockquote";
import { BoldToolbar } from "@/components/toolbars/bold";
import { BulletListToolbar } from "@/components/toolbars/bullet-list";
import { CodeToolbar } from "@/components/toolbars/code";
import { CodeBlockToolbar } from "@/components/toolbars/code-block";
import { FontSizeToolbar } from "@/components/toolbars/font-size";
import { HardBreakToolbar } from "@/components/toolbars/hard-break";
import { HorizontalRuleToolbar } from "@/components/toolbars/horizontal-rule";
import { ItalicToolbar } from "@/components/toolbars/italic";
import { OrderedListToolbar } from "@/components/toolbars/ordered-list";
import { StrikeThroughToolbar } from "@/components/toolbars/strikethrough";
import { ToolbarProvider } from "@/components/toolbars/toolbar-provider";
import { EditorContent, type Extension, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "tiptap-markdown";
import { Button } from "@/components/ui/button";
import { useJournalStore } from "@/stores/journalStore";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect, KeyboardEvent, ChangeEvent } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const MAX_CHARACTERS = 2000;

const extensions = [
  StarterKit.configure({
    orderedList: {
      HTMLAttributes: {
        class: "list-decimal",
      },
    },
    bulletList: {
      HTMLAttributes: {
        class: "list-disc",
      },
    },
    code: {
      HTMLAttributes: {
        class: "bg-accent rounded-md p-1",
      },
    },
    horizontalRule: {
      HTMLAttributes: {
        class: "my-2",
      },
    },
    codeBlock: {
      HTMLAttributes: {
        class: "bg-primary text-primary-foreground p-2 text-sm rounded-md p-1",
      },
    },
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {
        class: "tiptap-heading",
      },
    },
  }),
  Markdown.configure({
    html: false,
    transformPastedText: true,
    transformCopiedText: false,
  }),
];

const initialContent = `
Describe your day in detail. You can use markdown syntax to format your text.
`;

const NewJournalPage = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [characterCount, setCharacterCount] = useState(initialContent.length);
  const [isOverLimit, setIsOverLimit] = useState(false);
  const createJournalEntry = useJournalStore(
    (state) => state.createJournalEntry
  );
  const isLoading = useJournalStore((state) => state.isLoading);
  const navigate = useNavigate();

  const [emotions, setEmotions] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [emotionInput, setEmotionInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  // Add state to track if editor is focused and if we're on mobile
  const [isEditorFocused, setIsEditorFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleEmotionInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmotionInput(e.target.value);
  };

  const handleTagInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  const handleEmotionKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addEmotion();
    }
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const addEmotion = () => {
    const trimmedEmotion = emotionInput.trim();
    if (trimmedEmotion && !emotions.includes(trimmedEmotion)) {
      setEmotions([...emotions, trimmedEmotion]);
      setEmotionInput("");
    }
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput("");
    }
  };

  const removeEmotion = (emotionToRemove: string) => {
    setEmotions(emotions.filter((emotion) => emotion !== emotionToRemove));
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Update the editor configuration to directly handle focus/blur
  const editor = useEditor({
    extensions: extensions as Extension[],
    content: initialContent,
    immediatelyRender: false,
    autofocus: true,
    onUpdate: ({ editor }) => {
      // Get text content for character counting
      const text = editor.getText();
      setCharacterCount(text.length);
      setIsOverLimit(text.length > MAX_CHARACTERS);
    },
    onFocus: () => {
      if (isMobile) {
        setIsEditorFocused(true);
        console.log("Editor focused (mobile)");
      }
    },
    onBlur: () => {
      if (isMobile) {
        setIsEditorFocused(false);
        console.log("Editor blurred (mobile)");
      }
    },
  });

  // Keep mobile detection effect
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkMobile();

    // Add event listener
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Replace the existing focus handling useEffect
  useEffect(() => {
    // Only handle focus effects on mobile
    if (!isMobile) {
      // On desktop, always keep editor in normal state
      setIsEditorFocused(false);
      return;
    }

    // When on mobile, handle additional styling and scrolling when focused
    if (isEditorFocused && editor) {
      // Scroll the editor container into view when focused on mobile
      document.getElementById("editor-container")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isEditorFocused, isMobile, editor]);

  // Focus editor on initialization
  useEffect(() => {
    if (editor) {
      // Set a small timeout to ensure the editor is properly mounted
      setTimeout(() => {
        editor.commands.focus("end");
      }, 100); // Slightly increased timeout for better reliability
    }
  }, [editor]);

  // Function to enforce character limit on paste
  useEffect(() => {
    if (!editor) return;

    const handlePaste = () => {
      // Check if paste would exceed limit and truncate if needed
      setTimeout(() => {
        const currentText = editor.getText();
        if (currentText.length > MAX_CHARACTERS) {
          // Set content to truncated version
          const truncatedText = currentText.substring(0, MAX_CHARACTERS);
          editor.commands.setContent(truncatedText);
          setCharacterCount(truncatedText.length);
          setIsOverLimit(false);
          toast.warning(`Content truncated to ${MAX_CHARACTERS} characters`);
        }
      }, 0);
    };

    editor.on("paste", handlePaste);
    return () => {
      editor.off("paste", handlePaste);
    };
  }, [editor]);

  // Function to save the journal entry
  const saveJournal = async () => {
    if (!editor) return;

    if (isOverLimit) {
      toast.error(`Journal entry exceeds ${MAX_CHARACTERS} character limit`);
      return;
    }

    // Get markdown content from the editor
    const markdown = editor.storage.markdown.getMarkdown();

    if (!markdown.trim()) {
      toast.error("Journal entry cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      await createJournalEntry({
        entry: markdown,
        emotions: emotions,
        tags: tags,
      });

      toast.success("Journal saved successfully!");
      navigate("/dashboard/journals");
    } catch (error) {
      toast.error("Failed to save journal. Please try again.");
      console.error("Error saving journal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!editor) {
    return null;
  }

  const progressPercentage = (characterCount / MAX_CHARACTERS) * 100;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-4">
      <div className="flex justify-between items-center py-4">
        <h1 className="text-2xl font-bold">New Journal Entry</h1>

        {/* Save button + test buttons for debugging */}
        <div className="flex gap-2">
          {/* Uncomment for debugging
          <Button 
            size="sm" 
            variant="outline" 
            onClick={forceFocusEditor}
            className="text-xs"
          >
            Focus
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={forceBlurEditor}
            className="text-xs"
          >
            Blur
          </Button>
          */}

          <Button
            onClick={saveJournal}
            disabled={isLoading || isSaving || isOverLimit}
            className="bg-primary"
          >
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Journal"
            )}
          </Button>
        </div>
      </div>

      {/* Editor container with dynamic height */}
      <div
        id="editor-container"
        className={`border w-full relative rounded-md overflow-hidden 
    ${isMobile ? "transition-all duration-300 ease-in-out" : ""}
    ${
      isMobile && isEditorFocused
        ? "h-[75vh]" // Fixed height that leaves some hint of content below
        : "flex-1 min-h-[200px]"
    }
    flex flex-col`}
      >
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row w-full border-b sticky top-0 left-0 bg-background z-20">
          <ToolbarProvider editor={editor}>
            <div className="flex items-center p-2 gap-2 h-9 justify-start border-b sm:border-b-0 sm:border-r">
              <div className="flex items-center h-full">
                <BoldToolbar />
                <ItalicToolbar />
                <StrikeThroughToolbar />
                <FontSizeToolbar />
              </div>
              <Separator
                orientation="vertical"
                className="h-7 hidden sm:block"
              />
              <div className="flex items-center h-full">
                <BulletListToolbar />
                <OrderedListToolbar />
              </div>
            </div>

            {/* Second row on mobile / Right group on desktop */}
            <div className="flex items-center p-2 gap-2 h-9 justify-start">
              <div className="flex items-center h-full">
                <CodeToolbar />
                <CodeBlockToolbar />
                <HorizontalRuleToolbar />
                <BlockquoteToolbar />
                <HardBreakToolbar />
              </div>
            </div>
          </ToolbarProvider>
        </div>

        {/* Editor content - direct click handler to ensure focus works */}
        <div
          onClick={() => editor.commands.focus()}
          className="cursor-text overflow-y-auto flex-1 bg-background"
        >
          <EditorContent className="outline-none p-4 h-full" editor={editor} />
        </div>
      </div>

      {/* Bottom sections with conditional opacity */}
      <div
        className={`mt-4 space-y-4 transition-all duration-300 ease-in-out
    ${
      isMobile && isEditorFocused
        ? "opacity-50 max-h-[25vh] overflow-hidden" // Show partially visible hint
        : "opacity-100 max-h-[1000px]"
    }`}
      >
        <div className="mt-4 space-y-4">
          {/* Emotions input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Emotions (optional)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {emotions.map((emotion) => (
                <Badge
                  key={emotion}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {emotion}
                  <button
                    onClick={() => removeEmotion(emotion)}
                    className="ml-1 rounded-full hover:bg-secondary/80 p-0.5"
                    aria-label={`Remove ${emotion}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Input
                value={emotionInput}
                onChange={handleEmotionInputChange}
                onKeyDown={handleEmotionKeyDown}
                onBlur={addEmotion}
                placeholder="Add emotions (e.g., happy, excited, calm)"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Type an emotion and press enter or comma to add it
            </p>
          </div>

          {/* Tags input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags (optional)</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 rounded-full hover:bg-accent/50 p-0.5"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 items-center">
              <Input
                value={tagInput}
                onChange={handleTagInputChange}
                onKeyDown={handleTagKeyDown}
                onBlur={addTag}
                placeholder="Add tags (e.g., work, family, reflection)"
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Type a tag and press enter or comma to add it
            </p>
          </div>
        </div>

        {/* Character counter */}
        <div className="text-xs flex flex-col gap-1 py-2 mt-5">
          <div className="flex justify-between items-center">
            <span
              className={
                isOverLimit
                  ? "text-destructive font-medium"
                  : "text-muted-foreground"
              }
            >
              {characterCount} / {MAX_CHARACTERS} characters
            </span>
            {isOverLimit && (
              <span className="text-destructive font-medium">
                Character limit exceeded
              </span>
            )}
          </div>
          <Progress
            value={progressPercentage > 100 ? 100 : progressPercentage}
            className={`h-1 ${isOverLimit ? "bg-destructive" : ""}`}
          />
        </div>

        <div className="text-xs text-muted-foreground pb-4">
          <p>
            Your journal is saved in markdown format. You can use markdown
            syntax directly in the editor.
          </p>
          <p className="mt-1">
            Tip: Use the font size dropdown to easily change text sizes without
            knowing markdown.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewJournalPage;
