import { cn } from "@/lib/utils";

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  avatar?: string;
  timestamp?: string;
}

export const ChatMessage = ({ content, isUser, avatar, timestamp }: ChatMessageProps) => {
  return (
    <div className={cn(
      "flex gap-3 mb-4 animate-slide-up",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0",
        isUser 
          ? "bg-gradient-to-br from-accent to-primary text-accent-foreground shadow-soft" 
          : "bg-gradient-to-br from-primary/20 to-accent/20"
      )}>
        {avatar || (isUser ? "👤" : "🤖")}
      </div>
      <div className={cn(
        "flex flex-col max-w-[70%]",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-soft",
          isUser 
            ? "bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-tr-sm" 
            : "bg-card text-card-foreground rounded-tl-sm border border-border/50"
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-1 px-2">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};
