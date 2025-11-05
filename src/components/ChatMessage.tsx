import { Message } from "./ChatInterface";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
  showAvatar?: boolean;
  avatar?: string;
  avatarImage?: string;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";

  return (
    <div className={cn(
      "flex gap-3 items-end animate-fade-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl px-5 py-3 transition-all duration-300",
          isUser
            ? "bg-gradient-primary text-primary-foreground shadow-glow hover:shadow-glow-pink"
            : "glass-effect text-foreground border border-border/50"
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
      </div>
    </div>
  );
};
