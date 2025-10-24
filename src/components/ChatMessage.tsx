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
      "flex gap-3 items-end animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && showAvatar && (
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl flex-shrink-0">
          {avatar}
        </div>
      )}
      
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-gradient-primary text-primary-foreground shadow-glow"
            : "glass-effect text-foreground"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};
