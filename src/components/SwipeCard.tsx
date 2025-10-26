import { useState, useRef } from "react";
import { Tables } from "@/integrations/supabase/types";
import { Heart, X, Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

type Character = Tables<"characters">;

// Import character images
import mrsSharma from "@/assets/characters/mrs-sharma.jpg";
import anita from "@/assets/characters/anita.jpg";
import rhea from "@/assets/characters/rhea.jpg";
import sangeeta from "@/assets/characters/sangeeta.jpg";
import rekha from "@/assets/characters/rekha.jpg";
import preeti from "@/assets/characters/preeti.jpg";
import kavita from "@/assets/characters/kavita.jpg";
import tanvi from "@/assets/characters/tanvi.jpg";

const characterImages: Record<string, string> = {
  "mrs-sharma.jpg": mrsSharma,
  "anita.jpg": anita,
  "rhea.jpg": rhea,
  "sangeeta.jpg": sangeeta,
  "rekha.jpg": rekha,
  "preeti.jpg": preeti,
  "kavita.jpg": kavita,
  "tanvi.jpg": tanvi,
};

interface SwipeCardProps {
  character: Character;
  onSwipe: (direction: "left" | "right" | "up") => void;
  onChat: () => void;
}

export const SwipeCard = ({ character, onSwipe, onChat }: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
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
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100;
    if (Math.abs(offset.x) > threshold) {
      onSwipe(offset.x > 0 ? "right" : "left");
    } else if (offset.y < -threshold) {
      onSwipe("up");
    } else {
      setOffset({ x: 0, y: 0 });
    }
  };

  const rotation = offset.x / 20;
  const opacity = 1 - Math.abs(offset.x) / 300;

  const getOverlay = () => {
    if (offset.x > 50) return { color: "bg-green-500", icon: Heart, text: "LIKE" };
    if (offset.x < -50) return { color: "bg-red-500", icon: X, text: "NOPE" };
    if (offset.y < -50) return { color: "bg-blue-500", icon: Star, text: "SUPER" };
    return null;
  };

  const overlay = getOverlay();

  return (
    <div
      ref={cardRef}
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg)`,
        opacity: opacity,
        transition: isDragging ? "none" : "all 0.3s ease-out",
      }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div className="relative h-full bg-card rounded-3xl overflow-hidden border-2 border-border shadow-strong">
        {/* Overlay */}
        {overlay && (
          <div className={cn("absolute inset-0 flex items-center justify-center z-10", overlay.color, "bg-opacity-20")}>
            <div className={cn("text-white font-bold text-6xl px-8 py-4 rounded-2xl border-4 border-white", overlay.color)}>
              {overlay.text}
            </div>
          </div>
        )}

        {/* Background Image */}
        {character.image_url && (
          <div className="absolute inset-0">
            <img
              src={characterImages[character.image_url] || character.image_url}
              alt={character.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative h-full flex flex-col p-8">
          <div className="flex-1 flex flex-col items-center justify-end text-center pb-8">
            {!character.image_url && (
              <div className="text-9xl mb-6 animate-float">{character.avatar}</div>
            )}
            <h2 className="text-4xl font-bold text-foreground drop-shadow-lg mb-4">{character.name}</h2>
            <p className="text-lg text-foreground/90 drop-shadow-md mb-6 max-w-md">{character.description}</p>
            <div className="flex flex-wrap gap-3 justify-center mb-4">
              {character.tags && character.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 text-sm rounded-full glass-effect text-foreground backdrop-blur-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onChat();
            }}
            className="w-full py-4 bg-gradient-primary text-primary-foreground rounded-2xl font-bold text-lg shadow-glow hover:shadow-strong transition-all duration-300 flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-5 h-5" />
            Start Chatting
          </button>
        </div>
      </div>
    </div>
  );
};
