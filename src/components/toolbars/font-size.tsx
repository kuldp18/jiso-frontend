import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToolbar } from "./toolbar-provider";
import { Type as FontSizeIcon } from "lucide-react";

const fontSizes = [
  { title: "Heading 1", description: "Main heading", level: 1 },
  { title: "Heading 2", description: "Section heading", level: 2 },
  { title: "Heading 3", description: "Subsection heading", level: 3 },
  { title: "Heading 4", description: "Minor heading", level: 4 },
  { title: "Normal", description: "Regular paragraph text", level: 0 },
  { title: "Small", description: "Small text", level: 6 },
];

export function FontSizeToolbar() {
  const { editor } = useToolbar();

  const setFontSize = (level: number) => {
    if (level === 0) {
      // Remove heading and set to normal text
      editor?.chain().focus().setParagraph().run();
    } else {
      // Set appropriate heading level
      editor?.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <FontSizeIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent>
            {fontSizes.map((size) => (
              <DropdownMenuItem
                key={size.level}
                onClick={() => setFontSize(size.level)}
                className="cursor-pointer flex flex-col items-start"
              >
                <span className="font-medium">{size.title}</span>
                <span className="text-xs text-muted-foreground">
                  {size.description}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
          <TooltipContent side="bottom">
            <p>Font style</p>
          </TooltipContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
}
