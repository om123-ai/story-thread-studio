import { Navigation } from "@/components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Compass, Plus, Sparkles, Zap, Users, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCharacters } from "@/hooks/useCharacters";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const { data: characters } = useCharacters("", searchQuery);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10">
          <div className="inline-block mb-6">
            <div className="w-24 h-24 rounded-3xl bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
              <Sparkles className="w-14 h-14 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-cyber bg-clip-text text-transparent">
              Vibe Coder
            </span>
          </h1>
          
          <p className="text-2xl md:text-3xl font-semibold text-foreground mb-4 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Your AI Coding Companion
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Create personalized AI coding assistants with unique expertise, teaching styles, and personalities. Get help debugging, optimizing, and learning to code.
          </p>

          <div className="flex flex-wrap gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {user ? (
              <>
                <Button
                  onClick={() => navigate("/discover")}
                  size="lg"
                  className="bg-gradient-cyber shadow-glow hover:shadow-glow-purple text-lg px-10 py-6 text-primary-foreground"
                >
                  <Compass className="w-6 h-6 mr-2" />
                  Discover Coding Assistants
                </Button>
                <Button
                  onClick={() => navigate("/create")}
                  size="lg"
                  className="glass-effect hover:bg-gradient-code text-lg px-10 py-6"
                >
                  <Plus className="w-6 h-6 mr-2" />
                  Create Your Assistant
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="bg-gradient-cyber shadow-glow hover:shadow-glow-purple text-lg px-12 py-6 text-primary-foreground"
              >
                <MessageSquare className="w-6 h-6 mr-2" />
                Start Coding
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Search Section */}
      {user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="glass-effect p-8 rounded-2xl border border-border/50">
            <h2 className="text-2xl font-bold mb-6">Search Characters</h2>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by character name..."
                className="pl-12 h-12"
              />
            </div>
            
            {searchQuery && characters && characters.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((char) => (
                  <Card 
                    key={char.id}
                    className="p-4 cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => navigate(`/chat?characterId=${char.id}`)}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      {char.image_url ? (
                        <img 
                          src={char.image_url} 
                          alt={char.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-2xl">
                          {char.avatar}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{char.name}</h3>
                        <Badge variant="secondary" className="text-xs">{char.category}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {char.description}
                    </p>
                  </Card>
                ))}
              </div>
            )}
            
            {searchQuery && characters && characters.length === 0 && (
              <p className="text-center text-muted-foreground">No characters found</p>
            )}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="bg-gradient-cyber bg-clip-text text-transparent">
            Why Vibe Coder?
          </span>
        </h2>
        <p className="text-center text-muted-foreground mb-16 text-lg">
          The most advanced platform for AI-powered coding assistance
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-effect p-10 rounded-3xl border border-border/50 hover:border-primary/50 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-cyber flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Personalized Assistance</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Create coding assistants tailored to your learning style and expertise level with custom personalities.
            </p>
          </div>

          <div className="glass-effect p-10 rounded-3xl border border-border/50 hover:border-primary/50 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-code flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow-code">
              <Brain className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Context Aware</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Your assistant remembers project context and previous conversations for more relevant help.
            </p>
          </div>

          <div className="glass-effect p-10 rounded-3xl border border-border/50 hover:border-primary/50 transition-all duration-300 group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-cyber flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-glow">
              <Users className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-center">Multi-Specialty</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              From frontend to backend, AI/ML to DevOps - create assistants for every coding specialty.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
