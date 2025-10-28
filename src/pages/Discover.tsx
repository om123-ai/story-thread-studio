import { Navigation } from "@/components/Navigation";
import { useCharacters } from "@/hooks/useCharacters";
import { Loader2, Heart, X } from "lucide-react";
import { SwipeStack } from "@/components/SwipeStack";

const Discover = () => {
  const { data: characters = [], isLoading } = useCharacters();

  // Show all coding assistants in swipe interface
  const codingCharacters = characters;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-cyber bg-clip-text text-transparent">
            Discover Coding Assistants
          </h1>
          <p className="text-muted-foreground">Swipe to find your perfect AI coding companion</p>
        </div>

        {/* Swipe Instructions */}
        <div className="flex items-center justify-center gap-8 mb-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <span>Swipe left to pass</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Heart className="w-5 h-5 text-green-500" />
            </div>
            <span>Swipe right to like</span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : codingCharacters.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No coding assistants available yet!</p>
          </div>
        ) : (
          <SwipeStack characters={codingCharacters} />
        )}
      </div>
    </div>
  );
};

export default Discover;