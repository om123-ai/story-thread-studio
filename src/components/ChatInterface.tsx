import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Settings } from "lucide-react";
import { Character } from "./CharacterLibrary";
import { ChatSettings } from "./ChatSettings";
import { useToast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState(character.personality);
  const [showSettings, setShowSettings] = useState(false);
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
  }, [messages, isLoading]);

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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

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
      setIsLoading(false);
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
      {/* Header */}
      <div className="sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center justify-between p-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="hover:bg-secondary/80"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
                {character.avatar}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{character.name}</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Always active
                </p>
              </div>
            </div>
          </div>
          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-secondary/80"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-card border-l border-border/50">
              <SheetHeader>
                <SheetTitle className="text-foreground">Personality Settings</SheetTitle>
              </SheetHeader>
              <ChatSettings settings={settings} onSettingsChange={setSettings} />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-6 py-8 max-w-3xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12 space-y-4">
              <div className="text-6xl mb-4">{character.avatar}</div>
              <h3 className="text-xl font-semibold text-foreground">{character.name}</h3>
              <p className="text-muted-foreground max-w-md mx-auto">{character.description}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {character.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message}
              showAvatar={message.role === "assistant"}
              avatar={character.avatar}
            />
          ))}
          {isLoading && (
            <div className="flex gap-3 items-end">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl flex-shrink-0">
                {character.avatar}
              </div>
              <div className="bg-card border border-border/50 rounded-2xl px-4 py-3 shadow-soft rounded-bl-sm">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border/50 bg-card/80 backdrop-blur-md p-4">
        <form onSubmit={handleSendMessage} className="flex gap-3 max-w-3xl mx-auto">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${character.name}...`}
            className="min-h-[52px] max-h-[150px] resize-none bg-background border-border/50 text-foreground placeholder:text-muted-foreground rounded-2xl"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="bg-gradient-primary hover:shadow-glow h-[52px] w-[52px] flex-shrink-0 rounded-2xl"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
        <p className="text-xs text-center text-muted-foreground mt-2 max-w-3xl mx-auto">
          {character.name} is an AI and can make mistakes. Check important info.
        </p>
      </div>
    </div>
  );
};