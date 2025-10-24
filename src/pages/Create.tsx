import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const Create = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [characterData, setCharacterData] = useState({
    name: "",
    description: "",
    avatar: "🤖",
    tags: [] as string[],
    creativity: 50,
    emotion: 50,
    verbosity: 50,
  });

  const avatarOptions = ["🤖", "👨‍💼", "👩‍🎨", "🧙‍♂️", "🦸", "🧑‍🚀", "👩‍🔬", "🧑‍💻", "👨‍🎓", "🎭", "🦄", "🐉"];
  const tagOptions = ["Helpful", "Creative", "Friendly", "Wise", "Funny", "Professional", "Casual", "Energetic"];

  const handleCreate = () => {
    if (!characterData.name || !characterData.description) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Character created! 🎉",
      description: `${characterData.name} is ready to chat`,
    });

    setTimeout(() => navigate("/"), 1500);
  };

  const toggleTag = (tag: string) => {
    setCharacterData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    s <= step ? "bg-gradient-primary text-primary-foreground shadow-glow" : "glass-effect text-muted-foreground"
                  }`}
                >
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`flex-1 h-1 mx-2 rounded ${s < step ? "bg-gradient-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
          <p className="text-center text-muted-foreground">
            Step {step} of 3: {step === 1 ? "Basic Info" : step === 2 ? "Personality" : "Review"}
          </p>
        </div>

        {/* Step Content */}
        <Card className="glass-effect p-8 mb-8">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Create Your Character</h2>
                <p className="text-muted-foreground">Let's start with the basics</p>
              </div>

              <div>
                <Label className="text-foreground mb-2">Character Avatar</Label>
                <div className="grid grid-cols-6 gap-3 mt-2">
                  {avatarOptions.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => setCharacterData((prev) => ({ ...prev, avatar: emoji }))}
                      className={`text-5xl p-4 rounded-xl transition-all ${
                        characterData.avatar === emoji ? "bg-gradient-primary shadow-glow scale-110" : "glass-effect hover:scale-105"
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="name" className="text-foreground">Character Name *</Label>
                <Input
                  id="name"
                  value={characterData.name}
                  onChange={(e) => setCharacterData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Creative Helper"
                  className="mt-2 glass-effect"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-foreground">Description *</Label>
                <Textarea
                  id="description"
                  value={characterData.description}
                  onChange={(e) => setCharacterData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your character's personality and purpose..."
                  className="mt-2 glass-effect min-h-[120px]"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Personality Traits</h2>
                <p className="text-muted-foreground">Fine-tune how your character responds</p>
              </div>

              <div>
                <Label className="text-foreground mb-2">Character Tags</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tagOptions.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full transition-all ${
                        characterData.tags.includes(tag)
                          ? "bg-gradient-primary text-primary-foreground shadow-glow"
                          : "glass-effect text-foreground hover:border-primary/50"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-foreground">Creativity: {characterData.creativity}%</Label>
                <Slider
                  value={[characterData.creativity]}
                  onValueChange={(value) => setCharacterData((prev) => ({ ...prev, creativity: value[0] }))}
                  max={100}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-foreground">Emotion: {characterData.emotion}%</Label>
                <Slider
                  value={[characterData.emotion]}
                  onValueChange={(value) => setCharacterData((prev) => ({ ...prev, emotion: value[0] }))}
                  max={100}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-foreground">Verbosity: {characterData.verbosity}%</Label>
                <Slider
                  value={[characterData.verbosity]}
                  onValueChange={(value) => setCharacterData((prev) => ({ ...prev, verbosity: value[0] }))}
                  max={100}
                  className="mt-2"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Review Your Character</h2>
                <p className="text-muted-foreground">Everything looks good?</p>
              </div>

              <div className="glass-effect rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-6xl">{characterData.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-foreground mb-2">{characterData.name}</h3>
                    <p className="text-muted-foreground">{characterData.description}</p>
                  </div>
                </div>

                {characterData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {characterData.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary border border-primary/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="glass-effect rounded-xl p-3">
                    <div className="text-2xl font-bold text-primary">{characterData.creativity}%</div>
                    <div className="text-xs text-muted-foreground">Creativity</div>
                  </div>
                  <div className="glass-effect rounded-xl p-3">
                    <div className="text-2xl font-bold text-accent">{characterData.emotion}%</div>
                    <div className="text-xs text-muted-foreground">Emotion</div>
                  </div>
                  <div className="glass-effect rounded-xl p-3">
                    <div className="text-2xl font-bold text-secondary">{characterData.verbosity}%</div>
                    <div className="text-xs text-muted-foreground">Verbosity</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => (step > 1 ? setStep(step - 1) : navigate("/"))}
            className="glass-effect"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step > 1 ? "Previous" : "Cancel"}
          </Button>

          <Button
            onClick={() => (step < 3 ? setStep(step + 1) : handleCreate())}
            className="bg-gradient-primary shadow-glow"
          >
            {step < 3 ? (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Create Character
                <Check className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Create;
