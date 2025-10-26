import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SwipeCard } from "./SwipeCard";
import { Tables } from "@/integrations/supabase/types";
import { RotateCcw } from "lucide-react";
import { Button } from "./ui/button";

type Character = Tables<"characters">;

interface SwipeStackProps {
  characters: Character[];
}

export const SwipeStack = ({ characters }: SwipeStackProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledCharacters, setShuffledCharacters] = useState<Character[]>([]);

  useEffect(() => {
    // Shuffle characters on mount
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    setShuffledCharacters(shuffled);
  }, [characters]);

  const handleSwipe = (direction: "left" | "right" | "up") => {
    console.log(`Swiped ${direction} on character:`, shuffledCharacters[currentIndex]?.name);
    
    // Move to next character
    if (currentIndex < shuffledCharacters.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }

    // Optional: Handle different swipe actions
    if (direction === "right") {
      // Could save to favorites here
      console.log("Liked character");
    }
  };

  const handleChat = () => {
    const character = shuffledCharacters[currentIndex];
    if (character) {
      navigate(`/chat/${character.id}`);
    }
  };

  const handleRestart = () => {
    const shuffled = [...characters].sort(() => Math.random() - 0.5);
    setShuffledCharacters(shuffled);
    setCurrentIndex(0);
  };

  if (shuffledCharacters.length === 0) {
    return (
      <div className="flex items-center justify-center h-[600px]">
        <p className="text-muted-foreground text-lg">Loading characters...</p>
      </div>
    );
  }

  if (currentIndex >= shuffledCharacters.length) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] gap-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">No more characters!</h3>
          <p className="text-muted-foreground">You've seen all available characters</p>
        </div>
        <Button onClick={handleRestart} size="lg" className="gap-2">
          <RotateCcw className="w-5 h-5" />
          See them again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-md mx-auto" style={{ height: "600px" }}>
      {/* Render current card and 2 cards behind it for stack effect */}
      {shuffledCharacters.slice(currentIndex, currentIndex + 3).map((character, index) => (
        <div
          key={character.id}
          className="absolute inset-0 transition-all duration-300"
          style={{
            zIndex: 10 - index,
            transform: `scale(${1 - index * 0.05}) translateY(${index * 10}px)`,
            opacity: index === 0 ? 1 : 0.5,
            pointerEvents: index === 0 ? "auto" : "none",
          }}
        >
          <SwipeCard
            character={character}
            onSwipe={handleSwipe}
            onChat={handleChat}
          />
        </div>
      ))}
    </div>
  );
};
