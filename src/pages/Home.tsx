import { Navigation } from "@/components/Navigation";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Brain, MessageSquare, Compass, Plus, Sparkles, Zap, Users } from "lucide-react";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-block mb-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow animate-float">
            <Brain className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-primary bg-clip-text text-transparent">
            UltimateAI
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
          Create and chat with AI characters. Build your perfect AI companion in minutes.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          {user ? (
            <>
              <Button
                onClick={() => navigate("/discover")}
                size="lg"
                className="bg-gradient-primary shadow-glow text-lg px-8"
              >
                <Compass className="w-5 h-5 mr-2" />
                Discover Characters
              </Button>
              <Button
                onClick={() => navigate("/create")}
                size="lg"
                variant="outline"
                className="text-lg px-8"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Character
              </Button>
            </>
          ) : (
            <Button
              onClick={() => navigate("/auth")}
              size="lg"
              className="bg-gradient-primary shadow-glow text-lg px-8"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-effect p-8 rounded-2xl border border-border/50 text-center hover-scale">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart AI</h3>
            <p className="text-muted-foreground">
              Powered by advanced AI that understands context
            </p>
          </div>

          <div className="glass-effect p-8 rounded-2xl border border-border/50 text-center hover-scale">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Quick & Easy</h3>
            <p className="text-muted-foreground">
              Create custom characters in seconds
            </p>
          </div>

          <div className="glass-effect p-8 rounded-2xl border border-border/50 text-center hover-scale">
            <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Your Library</h3>
            <p className="text-muted-foreground">
              Save and manage all your characters
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
