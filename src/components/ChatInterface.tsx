import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, MoreVertical, Heart } from "lucide-react";
import { Character } from "./CharacterLibrary";
import { ChatSettings } from "./ChatSettings";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

interface ChatInterfaceProps {
  character: Character;
  onBack: () => void;
}

export const ChatInterface = ({ character, onBack }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [settings, setSettings] = useState(character.personality);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat_${character.id}`);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        content: getWelcomeMessage(),
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMessage]);
    }
  }, [character.id]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat_${character.id}`, JSON.stringify(messages));
    }
  }, [messages, character.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const getWelcomeMessage = () => {
    const greetings: Record<string, string> = {
      sage: "Greetings, seeker of wisdom. I sense you carry questions in your heart. What brings you to me today?",
      "creative-muse": "Hey there, creative soul! I'm so excited to explore ideas with you. What's sparking your imagination today?",
      companion: "Hey! So good to see you! How've you been? What's on your mind?",
      scholar: "Hello! I'm delighted to share knowledge with you. What fascinating topic shall we explore together?",
      adventurer: "Welcome, brave soul! Ready to embark on something extraordinary? What adventure calls to you?",
      storyteller: "Ah, a new chapter begins... Tell me, what tale shall we weave together today?"
    };
    return greetings[character.id] || `Hello! I'm ${character.name}. How can I help you today?`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const aiResponse = generateResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTyping(false);
    }
  };

  const generateResponse = (userInput: string): string => {
    // This is a placeholder - in production, this would call Lovable AI
    const responses: Record<string, string[]> = {
      sage: [
        "Your question reveals the depth of your understanding. Let me share a perspective...",
        "In my experience, such matters require careful contemplation. Consider this...",
        "Ah, a profound inquiry. The answer lies not in the destination, but the journey..."
      ],
      "creative-muse": [
        "Ooh, I love where your mind is going! What if we took this even further...",
        "That's brilliant! This reminds me of... have you considered...",
        "Yes yes yes! And imagine if we combined that with..."
      ],
      companion: [
        "I totally get what you mean! That reminds me of...",
        "Aw, thanks for sharing that with me! You know what I think?",
        "Hey, that's actually really interesting! So here's my take..."
      ],
      scholar: [
        "Excellent question! Let me elaborate on the underlying principles...",
        "That's a fascinating topic with multiple dimensions. First, consider...",
        "Based on established research, we can approach this from several angles..."
      ],
      adventurer: [
        "Now we're talking! This is going to be epic! Here's what we do...",
        "I love your energy! Let's push this even further - what if...",
        "Yes! And after that, imagine the possibilities when..."
      ],
      storyteller: [
        "Ah, the plot thickens... As our tale unfolds, we discover that...",
        "And so, dear friend, in this moment of our shared narrative...",
        "Let me paint you a picture of what happens next..."
      ]
    };

    const characterResponses = responses[character.id] || responses.companion;
    const baseResponse = characterResponses[Math.floor(Math.random() * characterResponses.length)];
    
    // Adjust response based on settings
    let response = baseResponse;
    if (settings.verbosity > 70) {
      response += " " + "There's much more to explore here, and I believe understanding these nuances will serve you well.";
    }
    if (settings.emotion > 70) {
      response += " I can sense this matters deeply to you! ";
    }
    
    return response;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Instagram-style Header */}
      <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-border">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="hover:bg-secondary rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          
          <div className="flex-1 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-xl border-2 border-primary/50">
                {character.avatar}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-primary border-2 border-card" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-sm">{character.name}</h2>
              <p className="text-xs text-primary">Active now</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-secondary rounded-full text-destructive"
          >
            <Heart className="h-5 w-5" />
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-secondary rounded-full"
              >
                <MoreVertical className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-l border-border">
              <SheetHeader>
                <SheetTitle className="text-foreground">Chat Settings</SheetTitle>
              </SheetHeader>
              <ChatSettings settings={settings} onSettingsChange={setSettings} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={messagesEndRef}>
        {messages.map((message, index) => (
          <ChatMessage 
            key={message.id} 
            message={message}
            showAvatar={message.role === "assistant" && (index === 0 || messages[index - 1]?.role !== "assistant")}
            avatar={character.avatar}
          />
        ))}
        {isTyping && (
          <div className="flex gap-2 items-end">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm flex-shrink-0">
              {character.avatar}
            </div>
            <div className="bg-secondary rounded-2xl px-4 py-2.5 rounded-bl-sm">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-primary/60 animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Instagram-style Input */}
      <div className="sticky bottom-0 bg-card/95 backdrop-blur-sm border-t border-border p-3">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${character.name}...`}
            className={cn(
              "flex-1 bg-secondary/80 border-secondary text-foreground placeholder:text-muted-foreground",
              "rounded-full px-4 py-2.5 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary"
            )}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim() || isTyping}
            className={cn(
              "rounded-full w-10 h-10 flex-shrink-0",
              input.trim() 
                ? "bg-gradient-primary hover:shadow-glow" 
                : "bg-secondary text-muted-foreground hover:bg-secondary"
            )}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
