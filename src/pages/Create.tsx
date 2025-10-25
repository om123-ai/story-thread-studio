import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCreateCharacter } from "@/hooks/useCharacters";
import { Loader2, Sparkles } from "lucide-react";

const AVATAR_OPTIONS = ["🤖", "👨", "👩", "🧙", "🦸", "🐱", "🦊", "🦁", "🐼", "🐨"];
const TAG_OPTIONS = [
  "Friendly",
  "Helpful",
  "Creative",
  "Analytical",
  "Humorous",
  "Professional",
  "Casual",
  "Empathetic",
];
const CATEGORIES = ["Fantasy", "Sci-Fi", "Professional", "Casual", "Educational", "Entertainment"];

const Create = () => {
  const navigate = useNavigate();
  const createCharacter = useCreateCharacter();
  const [characterData, setCharacterData] = useState({
    name: "",
    description: "",
    avatar: "🤖",
    category: "Casual",
    tags: [] as string[],
    creativity: 50,
    emotion: 50,
    memory: 50,
  });

  const toggleTag = (tag: string) => {
    setCharacterData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleCreate = async () => {
    if (!characterData.name || !characterData.description) {
      return;
    }

    await createCharacter.mutateAsync({
      name: characterData.name,
      description: characterData.description,
      avatar: characterData.avatar,
      category: characterData.category,
      tags: characterData.tags,
      creativity: characterData.creativity,
      emotion: characterData.emotion,
      memory: characterData.memory,
    });

    navigate("/discover");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-8 glass-effect border-border/50">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Create Character
            </h1>

            <div className="space-y-6">
              {/* Avatar */}
              <div className="space-y-2">
                <Label>Avatar</Label>
                <div className="flex flex-wrap gap-2">
                  {AVATAR_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setCharacterData({ ...characterData, avatar: emoji })}
                      className={`text-3xl w-14 h-14 rounded-xl border-2 transition-all hover:scale-110 ${
                        characterData.avatar === emoji
                          ? "border-primary bg-primary/20"
                          : "border-border"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={characterData.name}
                  onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
                  placeholder="Enter character name"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={characterData.category}
                  onChange={(e) =>
                    setCharacterData({ ...characterData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={characterData.description}
                  onChange={(e) =>
                    setCharacterData({ ...characterData, description: e.target.value })
                  }
                  placeholder="Describe your character..."
                  rows={4}
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Personality Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={characterData.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Creativity: {characterData.creativity}%</Label>
                  <Slider
                    value={[characterData.creativity]}
                    onValueChange={([value]) =>
                      setCharacterData({ ...characterData, creativity: value })
                    }
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Emotion: {characterData.emotion}%</Label>
                  <Slider
                    value={[characterData.emotion]}
                    onValueChange={([value]) =>
                      setCharacterData({ ...characterData, emotion: value })
                    }
                    max={100}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Memory: {characterData.memory}%</Label>
                  <Slider
                    value={[characterData.memory]}
                    onValueChange={([value]) =>
                      setCharacterData({ ...characterData, memory: value })
                    }
                    max={100}
                    step={1}
                  />
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={createCharacter.isPending || !characterData.name || !characterData.description}
                className="w-full bg-gradient-primary shadow-glow"
              >
                {createCharacter.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Character
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Live Preview */}
          <Card className="p-8 glass-effect border-border/50 sticky top-24 h-fit">
            <h2 className="text-xl font-semibold mb-6">Preview</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-4xl">
                  {characterData.avatar}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {characterData.name || "Character Name"}
                  </h3>
                  <Badge variant="secondary">{characterData.category}</Badge>
                </div>
              </div>

              <p className="text-muted-foreground">
                {characterData.description || "Character description will appear here..."}
              </p>

              {characterData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {characterData.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="space-y-3 pt-4 border-t border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Creativity</span>
                  <span className="font-medium">{characterData.creativity}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Emotion</span>
                  <span className="font-medium">{characterData.emotion}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Memory</span>
                  <span className="font-medium">{characterData.memory}%</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Create;