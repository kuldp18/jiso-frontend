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
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useJournalStore } from "@/stores/journalStore";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

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
  });

  // Focus editor on initialization
  useEffect(() => {
    if (editor) {
      // Set a small timeout to ensure the editor is properly mounted
      setTimeout(() => {
        editor.commands.focus("end");
      }, 10);
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
        emotions: [], // You can add emotions selection if needed
        tags: [], // You can add tags selection if needed
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

      <div className="border w-full relative rounded-md overflow-hidden flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row w-full border-b sticky top-0 left-0 bg-background z-20">
          <ToolbarProvider editor={editor}>
            {/* First row on mobile / Left group on desktop */}
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
        <div
          onClick={() => {
            editor?.chain().focus().run();
          }}
          className="cursor-text overflow-y-auto flex-1 bg-background"
        >
          <EditorContent className="outline-none p-4 h-full" editor={editor} />
        </div>
      </div>

      {/* Character counter */}
      <div className="text-xs flex flex-col gap-1 py-2">
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
          className={`h-1 ${isOverLimit ? "bg-destructive/20" : ""}`}
          indicatorClassName={isOverLimit ? "bg-destructive" : undefined}
        />
      </div>

      <div className="text-xs text-muted-foreground pb-4">
        <p>
          Your journal is saved in markdown format. You can use markdown syntax
          directly in the editor.
        </p>
        <p className="mt-1">
          Tip: Use the font size dropdown to easily change text sizes without
          knowing markdown.
        </p>
      </div>
    </div>
  );
};

export default NewJournalPage;
