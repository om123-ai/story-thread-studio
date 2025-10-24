import { useState } from "react";
import { Sparkles } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between p-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Vibe AI</h1>
          </div>
        </div>
      </div>

      {/* Character Grid */}
      <div className="p-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Choose Your Character</h2>
          <p className="text-muted-foreground">Select an AI companion to start chatting</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEFAULT_CHARACTERS.map((character) => (
            <div
              key={character.id}
              onClick={() => onSelectCharacter(character)}
              className="group relative bg-card border border-border/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-glow hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-5xl">{character.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-foreground mb-1 truncate">{character.name}</h3>
                    <p className="text-xs text-muted-foreground">{character.messageCount.toLocaleString()} messages</p>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{character.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {character.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full py-2.5 px-4 bg-gradient-primary text-primary-foreground rounded-xl font-semibold transition-all duration-300 group-hover:shadow-glow">
                  Chat Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
