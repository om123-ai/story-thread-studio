import { useState, useRef, useEffect } from "react";
import { Heart, X, MessageCircle, Sparkles } from "lucide-react";
import { Character } from "./CharacterLibrary";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SwipeCardProps {
  character: Character;
  onSwipe: (direction: "left" | "right") => void;
  onChat: () => void;
  style?: React.CSSProperties;
}

export const SwipeCard = ({ character, onSwipe, onChat, style }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showAction, setShowAction] = useState<"like" | "skip" | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    startPos.current = { x: clientX, y: clientY };
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPos.current.x;
    const deltaY = clientY - startPos.current.y;
    setDragOffset({ x: deltaX, y: deltaY });

    if (Math.abs(deltaX) > 50) {
      setShowAction(deltaX > 0 ? "like" : "skip");
    } else {
      setShowAction(null);
    }
  };

  const handleEnd = () => {
    setIsDragging(false);
    
    if (Math.abs(dragOffset.x) > 120) {
      onSwipe(dragOffset.x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
      setShowAction(null);
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "absolute inset-4 rounded-2xl overflow-hidden touch-none select-none",
        "bg-gradient-card border-2 border-border shadow-strong",
        isDragging ? "cursor-grabbing scale-105" : "cursor-grab"
      )}
      style={{
        ...style,
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${dragOffset.x * 0.05}deg)`,
        transition: isDragging ? "none" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      {/* Character Avatar/Image */}
      <div className="relative h-[65%] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
        <div className="text-[12rem] animate-float">{character.avatar}</div>
        <div className="absolute inset-0" style={{ backgroundImage: "var(--gradient-overlay)" }} />
        
        {/* Action Indicators */}
        {showAction === "like" && (
          <div className="absolute inset-0 flex items-center justify-center bg-primary/20 animate-heart-pop">
            <Heart className="w-32 h-32 text-primary fill-primary" />
          </div>
        )}
        {showAction === "skip" && (
          <div className="absolute inset-0 flex items-center justify-center bg-destructive/20">
            <X className="w-32 h-32 text-destructive stroke-[3]" />
          </div>
        )}
      </div>

      {/* Character Info */}
      <div className="h-[35%] p-6 space-y-3 bg-card">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {character.name}
              <Sparkles className="w-5 h-5 text-primary" />
            </h2>
            <p className="text-muted-foreground text-sm">
              {character.messageCount.toLocaleString()} conversations
            </p>
          </div>
        </div>

        <p className="text-foreground/80 text-sm line-clamp-2">
          {character.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {character.tags.map((tag, idx) => (
            <Badge 
              key={idx} 
              variant="secondary"
              className="bg-secondary/80 hover:bg-secondary text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4 px-6">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwipe("left");
          }}
          className="w-14 h-14 rounded-full bg-card border-2 border-destructive flex items-center justify-center hover:bg-destructive/10 hover:scale-110 transition-all shadow-medium"
        >
          <X className="w-6 h-6 text-destructive" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onChat();
          }}
          className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center hover:scale-110 transition-all shadow-glow"
        >
          <MessageCircle className="w-7 h-7 text-primary-foreground" />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSwipe("right");
          }}
          className="w-14 h-14 rounded-full bg-card border-2 border-primary flex items-center justify-center hover:bg-primary/10 hover:scale-110 transition-all shadow-medium"
        >
          <Heart className="w-6 h-6 text-primary" />
        </button>
      </div>
    </div>
  );
};
