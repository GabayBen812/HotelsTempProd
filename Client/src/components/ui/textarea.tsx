import * as React from "react";

import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  autoExpand?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoExpand, ...props }, ref) => {
    const handleInput = () => {
      if (ref && "current" in ref && ref.current) {
        const textarea = ref.current;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    };
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-border bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          autoExpand && "resize-none overflow-hidden",
          className
        )}
        ref={ref}
        {...props}
        onInput={autoExpand ? handleInput : props.onInput}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
