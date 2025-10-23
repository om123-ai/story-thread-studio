import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Settings, Loader2 } from "lucide-react";
import { Character } from "./CharacterLibrary";
import { ChatSettings } from "./ChatSettings";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
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
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState(character.personality);
  const scrollRef = useRef<HTMLDivElement>(null);
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
        isUser: false,
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
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Simulate AI response with personality
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
      
      const aiResponse = generateResponse(input);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm shadow-soft px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onBack}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="text-3xl">{character.avatar}</div>
            <div>
              <h2 className="font-semibold text-lg">{character.name}</h2>
              <p className="text-xs text-muted-foreground">Always remembers your conversations</p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowSettings(!showSettings)}
          className="hover:bg-secondary"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="max-w-4xl mx-auto">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  isUser={message.isUser}
                  avatar={message.isUser ? undefined : character.avatar}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl bg-gradient-to-br from-primary/20 to-accent/20">
                    {character.avatar}
                  </div>
                  <div className="bg-card rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft border border-border/50">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={scrollRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-background border-border/50 focus:border-primary"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSend} 
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 shadow-soft"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Sidebar */}
        {showSettings && (
          <ChatSettings
            settings={settings}
            onSettingsChange={setSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </div>
    </div>
  );
};
