import { useState } from "react";
import { Character, DEFAULT_CHARACTERS } from "@/components/CharacterLibrary";
import { Navigation } from "@/components/Navigation";
import { SwipeCard } from "@/components/SwipeCard";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Grid3x3, Layers, Heart, X, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Discover = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"swipe" | "grid">("swipe");
  const [characters, setCharacters] = useState(DEFAULT_CHARACTERS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Creative", "Helpful", "Fun", "Educational"];

  const handleSwipe = (direction: "left" | "right" | "up") => {
    const messages = {
      left: "Character skipped",
      right: "Added to favorites! ❤️",
      up: "Super liked! ⭐",
    };

    toast({
      title: messages[direction],
      duration: 2000,
    });

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % characters.length);
    }, 300);
  };

  const handleAction = (action: "like" | "dislike" | "super") => {
    const direction = action === "like" ? "right" : action === "dislike" ? "left" : "up";
    handleSwipe(direction);
  };

  const currentCharacter = characters[currentIndex];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Discover</h1>
            <p className="text-muted-foreground">Find your perfect AI companion</p>
          </div>

          <div className="flex gap-2">
            <Button
              variant={viewMode === "swipe" ? "default" : "ghost"}
              onClick={() => setViewMode("swipe")}
              className={viewMode === "swipe" ? "bg-gradient-primary shadow-glow" : ""}
            >
              <Layers className="w-4 h-4 mr-2" />
              Swipe
            </Button>
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-gradient-primary shadow-glow" : ""}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              Grid
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterBar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        {viewMode === "swipe" ? (
          /* Swipe Mode */
          <div className="flex flex-col items-center">
            <div className="relative w-full max-w-2xl h-[600px] mb-8">
              {currentCharacter && (
                <SwipeCard
                  character={currentCharacter}
                  onSwipe={handleSwipe}
                  onChat={() => navigate(`/chat/${currentCharacter.id}`)}
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-6">
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAction("dislike")}
                className="w-16 h-16 rounded-full border-2 border-red-500 hover:bg-red-500/20"
              >
                <X className="w-8 h-8 text-red-500" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAction("super")}
                className="w-16 h-16 rounded-full border-2 border-blue-500 hover:bg-blue-500/20"
              >
                <Star className="w-8 h-8 text-blue-500" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => handleAction("like")}
                className="w-16 h-16 rounded-full border-2 border-green-500 hover:bg-green-500/20"
              >
                <Heart className="w-8 h-8 text-green-500" />
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              {currentIndex + 1} of {characters.length} characters
            </p>
          </div>
        ) : (
          /* Grid Mode */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <div
                key={character.id}
                onClick={() => navigate(`/chat/${character.id}`)}
                className="group glass-effect rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-glow hover:-translate-y-1"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{character.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground mb-1 truncate">{character.name}</h3>
                    <p className="text-xs text-muted-foreground">{character.messageCount.toLocaleString()} chats</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{character.description}</p>

                <div className="flex flex-wrap gap-2">
                  {character.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
