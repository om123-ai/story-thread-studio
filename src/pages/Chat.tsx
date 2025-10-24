import { useParams, useNavigate } from "react-router-dom";
import { DEFAULT_CHARACTERS } from "@/components/CharacterLibrary";
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";

const Chat = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();

  const character = DEFAULT_CHARACTERS.find((c) => c.id === characterId);

  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Character not found</h2>
          <p className="text-muted-foreground mb-4">The character you're looking for doesn't exist</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-xl font-semibold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex-1">
        <ChatInterface character={character} onBack={() => navigate("/")} />
      </div>
    </div>
  );
};

export default Chat;
