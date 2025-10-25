import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { useChatStream } from "@/hooks/useChatStream";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatMessage } from "@/components/ChatMessage";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Chat = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { sendMessage, isStreaming } = useChatStream();
  
  const [character, setCharacter] = useState<any>(null);
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadCharacterAndConversation();
  }, [characterId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadCharacterAndConversation = async () => {
    try {
      const { data: char } = await supabase
        .from('characters')
        .select('*')
        .eq('id', characterId)
        .single();

      if (!char) {
        navigate('/discover');
        return;
      }

      setCharacter(char);

      let { data: conv } = await supabase
        .from('conversations')
        .select('*')
        .eq('character_id', characterId)
        .maybeSingle();

      if (!conv) {
        const { data: { user } } = await supabase.auth.getUser();
        const { data: newConv } = await supabase
          .from('conversations')
          .insert({ 
            character_id: characterId, 
            title: `Chat with ${char.name}`,
            user_id: user!.id 
          })
          .select()
          .single();
        conv = newConv;
      }

      setConversation(conv);

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: true });

      setMessages(msgs || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !conversation || isStreaming) return;

    const userMessage = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage, created_at: new Date().toISOString() }]);

    let assistantMessage = "";
    setMessages(prev => [...prev, { role: 'assistant', content: "", created_at: new Date().toISOString() }]);

    await sendMessage({
      conversationId: conversation.id,
      message: userMessage,
      characterId: characterId!,
      onChunk: (text) => {
        assistantMessage += text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            ...newMessages[newMessages.length - 1],
            content: assistantMessage
          };
          return newMessages;
        });
      },
      onComplete: () => {
        loadCharacterAndConversation();
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: error,
          variant: "destructive",
        });
        setMessages(prev => prev.slice(0, -1));
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      <Navigation />
      
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="p-4 border-b border-border/50 glass-effect flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/discover')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-2xl">
              {character?.avatar}
            </div>
            <div>
              <h2 className="font-semibold">{character?.name}</h2>
              <p className="text-xs text-muted-foreground">{character?.category}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg}
              showAvatar={!idx || messages[idx - 1]?.role !== msg.role}
              avatar={msg.role === 'assistant' ? character?.avatar : undefined}
            />
          ))}
          {isStreaming && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border/50 glass-effect">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              className="min-h-[60px] resize-none"
              disabled={isStreaming}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className="bg-gradient-primary shadow-glow"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;