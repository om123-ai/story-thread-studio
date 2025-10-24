import { useState } from "react";
import { Character, DEFAULT_CHARACTERS } from "@/components/CharacterLibrary";
import { Navigation } from "@/components/Navigation";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Sparkles } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();
  const [recentChats] = useState<Character[]>(DEFAULT_CHARACTERS.slice(0, 3));

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow animate-glow-pulse">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Welcome to UltimateAI
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience next-generation AI conversations with characters that truly understand you
          </p>
        </div>

        {/* Recent Chats */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Recent Chats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentChats.map((character) => (
              <div
                key={character.id}
                onClick={() => navigate(`/chat/${character.id}`)}
                className="group relative glass-effect rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-glow hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-5xl">{character.avatar}</div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{character.name}</h3>
                    <p className="text-xs text-muted-foreground">Continue chatting</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{character.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            onClick={() => navigate("/discover")}
            className="group glass-effect rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-glow hover:-translate-y-1"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Discover Characters</h3>
            <p className="text-muted-foreground">
              Explore our library of AI characters and find your perfect match
            </p>
          </div>

          <div
            onClick={() => navigate("/create")}
            className="group glass-effect rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:border-secondary/50 hover:shadow-glow-purple hover:-translate-y-1"
          >
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-2xl font-bold text-foreground mb-2">Create Your Own</h3>
            <p className="text-muted-foreground">
              Design a custom AI character with unique personality and traits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
