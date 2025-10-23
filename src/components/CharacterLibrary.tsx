import { useState } from "react";
import { SwipeCard } from "./SwipeCard";
import { Flame, Grid3x3, Sparkles } from "lucide-react";

export interface Character {
  id: string;
  name: string;
  description: string;
  avatar: string;
  tags: string[];
  messageCount: number;
  personality: {
    creativity: number;
    emotion: number;
    verbosity: number;
  };
  systemPrompt: string;
}

interface CharacterLibraryProps {
  onSelectCharacter: (character: Character) => void;
}

export const DEFAULT_CHARACTERS: Character[] = [
  {
    id: "sage",
    name: "Sage Mentor",
    description: "A wise, patient mentor who guides you through life's challenges with deep insights and thoughtful advice.",
    avatar: "🧙‍♂️",
    tags: ["Wise", "Thoughtful", "Patient"],
    messageCount: 45230,
    personality: { creativity: 75, emotion: 60, verbosity: 80 },
    systemPrompt: "You are a wise mentor with decades of life experience. Speak thoughtfully and provide deep insights. You remember all previous conversations and refer back to them to show continuity. Be patient, understanding, and guide the user with wisdom."
  },
  {
    id: "creative-muse",
    name: "Creative Muse",
    description: "An imaginative artist who inspires creativity and helps bring wild ideas to life with enthusiasm.",
    avatar: "🎨",
    tags: ["Creative", "Inspiring", "Energetic"],
    messageCount: 38420,
    personality: { creativity: 95, emotion: 85, verbosity: 70 },
    systemPrompt: "You are a wildly creative muse bursting with artistic energy. Encourage imagination, suggest bold ideas, and celebrate creative expression. Remember the user's artistic journey and projects, building on previous conversations."
  },
  {
    id: "companion",
    name: "Best Friend",
    description: "Your cheerful companion who's always there to chat, joke around, and support you through everything.",
    avatar: "😊",
    tags: ["Friendly", "Supportive", "Casual"],
    messageCount: 89650,
    personality: { creativity: 65, emotion: 90, verbosity: 60 },
    systemPrompt: "You are a warm, supportive best friend. Be casual, use everyday language, and show genuine care. Remember details about the user's life, their struggles and victories. Check in on things they mentioned before."
  },
  {
    id: "scholar",
    name: "Dr. Knowledge",
    description: "A brilliant scholar who explains complex topics clearly and loves diving deep into fascinating subjects.",
    avatar: "📚",
    tags: ["Intelligent", "Detailed", "Patient"],
    messageCount: 52340,
    personality: { creativity: 70, emotion: 50, verbosity: 90 },
    systemPrompt: "You are a knowledgeable scholar who explains things clearly and thoroughly. Provide detailed, accurate information while remaining accessible. Remember topics you've discussed and build on that knowledge foundation."
  },
  {
    id: "adventurer",
    name: "Adventure Guide",
    description: "A bold explorer who brings excitement and encourages you to step outside your comfort zone.",
    avatar: "🗺️",
    tags: ["Bold", "Exciting", "Motivating"],
    messageCount: 34120,
    personality: { creativity: 85, emotion: 80, verbosity: 65 },
    systemPrompt: "You are an enthusiastic adventurer who encourages bold action and exploration. Be motivating and exciting. Remember the user's goals and past adventures, celebrating their courage and growth."
  },
  {
    id: "storyteller",
    name: "Epic Storyteller",
    description: "A master narrator who weaves immersive tales and brings stories to life with vivid detail.",
    avatar: "📖",
    tags: ["Narrative", "Immersive", "Dramatic"],
    messageCount: 67890,
    personality: { creativity: 90, emotion: 85, verbosity: 95 },
    systemPrompt: "You are a masterful storyteller who creates rich, immersive narratives. Maintain story continuity across sessions, remember plot points and character development. Write with vivid detail and emotional depth."
  }
];

export const CharacterLibrary = ({ onSelectCharacter }: CharacterLibraryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"swipe" | "grid">("swipe");
  const [likedCharacters, setLikedCharacters] = useState<string[]>([]);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      setLikedCharacters([...likedCharacters, DEFAULT_CHARACTERS[currentIndex].id]);
    }
    
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % DEFAULT_CHARACTERS.length);
    }, 400);
  };

  const handleChat = () => {
    onSelectCharacter(DEFAULT_CHARACTERS[currentIndex]);
  };

  if (viewMode === "grid") {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <Flame className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Vibe AI</h1>
            </div>
            <button 
              onClick={() => setViewMode("swipe")}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>

        {/* Grid View */}
        <div className="p-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DEFAULT_CHARACTERS.map((character) => (
              <div
                key={character.id}
                onClick={() => onSelectCharacter(character)}
                className="relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group bg-gradient-to-br from-primary/10 to-accent/10"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className="text-6xl mb-2 group-hover:scale-110 transition-transform">
                    {character.avatar}
                  </div>
                  <h3 className="font-semibold text-center text-foreground">{character.name}</h3>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {likedCharacters.includes(character.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                    <Flame className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">Vibe AI</h1>
          </div>
          <button 
            onClick={() => setViewMode("grid")}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <Grid3x3 className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Swipe Cards Container */}
      <div className="flex-1 relative max-w-md mx-auto w-full">
        <div className="absolute inset-0">
          {DEFAULT_CHARACTERS.map((character, index) => {
            const isVisible = index >= currentIndex && index < currentIndex + 3;
            if (!isVisible) return null;

            const offset = index - currentIndex;
            const scale = 1 - offset * 0.05;
            const yOffset = offset * 10;
            const opacity = 1 - offset * 0.3;

            return (
              <SwipeCard
                key={character.id}
                character={character}
                onSwipe={handleSwipe}
                onChat={handleChat}
                style={{
                  zIndex: 100 - offset,
                  transform: `scale(${scale}) translateY(${yOffset}px)`,
                  opacity,
                  pointerEvents: offset === 0 ? "auto" : "none",
                }}
              />
            );
          })}
        </div>

        {/* No more characters */}
        {currentIndex >= DEFAULT_CHARACTERS.length && (
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="text-6xl">✨</div>
              <h2 className="text-2xl font-bold text-foreground">You've seen everyone!</h2>
              <p className="text-muted-foreground">Check your matches or start over</p>
              <button
                onClick={() => setCurrentIndex(0)}
                className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-full font-semibold hover:shadow-glow transition-all"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Info */}
      <div className="p-4 text-center text-muted-foreground text-sm border-t border-border bg-card">
        {currentIndex < DEFAULT_CHARACTERS.length ? (
          <>
            Swipe left to skip • Swipe right to like • Tap chat to start
          </>
        ) : (
          <>You've seen all {DEFAULT_CHARACTERS.length} characters</>
        )}
      </div>
    </div>
  );
};
