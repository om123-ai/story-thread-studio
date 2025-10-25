import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { FilterBar } from "@/components/FilterBar";
import { useCharacters } from "@/hooks/useCharacters";
import { MessageSquare, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Discover = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: characters = [], isLoading } = useCharacters(
    activeCategory === "All" ? undefined : activeCategory,
    searchQuery || undefined
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Discover Characters
          </h1>
          <p className="text-muted-foreground">Find your perfect AI companion</p>
        </div>

        <FilterBar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : characters.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No characters found. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character: any) => (
              <div
                key={character.id}
                onClick={() => navigate(`/chat/${character.id}`)}
                className="glass-effect rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-glow hover:-translate-y-1 border border-border/50"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-3xl">
                    {character.avatar}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{character.name}</h3>
                    <Badge variant="secondary" className="text-xs">{character.category}</Badge>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {character.description}
                </p>

                {character.tags && character.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {character.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Click to chat</span>
                  <MessageSquare className="w-4 h-4" />
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