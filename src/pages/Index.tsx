import { useState } from "react";
import { CharacterLibrary, Character } from "@/components/CharacterLibrary";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

  if (selectedCharacter) {
    return (
      <ChatInterface 
        character={selectedCharacter} 
        onBack={() => setSelectedCharacter(null)} 
      />
    );
  }

  return <CharacterLibrary onSelectCharacter={setSelectedCharacter} />;
};

export default Index;
