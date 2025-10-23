import { Message } from "./ChatInterface";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
  avatar?: string;
}

export const ChatMessage = ({ message, showAvatar = false, avatar }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={cn(
      "flex gap-2 items-end animate-slide-up",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && showAvatar && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm flex-shrink-0">
          {avatar}
        </div>
      )}
      {!isUser && !showAvatar && <div className="w-8" />}
      
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 shadow-soft",
          isUser
            ? "bg-gradient-primary text-primary-foreground rounded-br-sm"
            : "bg-secondary text-foreground rounded-bl-sm"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
      </div>
      
      {isUser && <div className="w-8" />}
    </div>
  );
};
