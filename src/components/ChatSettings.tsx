import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X, Sparkles, Heart, MessageSquare } from "lucide-react";

interface ChatSettingsProps {
  settings: {
    creativity: number;
    emotion: number;
    verbosity: number;
  };
  onSettingsChange: (settings: { creativity: number; emotion: number; verbosity: number }) => void;
  onClose: () => void;
}

export const ChatSettings = ({ settings, onSettingsChange, onClose }: ChatSettingsProps) => {
  return (
    <div className="w-80 border-l border-border/50 bg-card/50 backdrop-blur-sm p-6 overflow-y-auto animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Personality Settings</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="p-4 bg-gradient-card border-border/50 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <Label className="font-medium">Creativity</Label>
          </div>
          <Slider
            value={[settings.creativity]}
            onValueChange={(value) => onSettingsChange({ ...settings, creativity: value[0] })}
            max={100}
            step={1}
            className="mb-2"
          />
          <p className="text-xs text-muted-foreground">
            {settings.creativity < 40 && "Conservative and predictable"}
            {settings.creativity >= 40 && settings.creativity < 70 && "Balanced creativity"}
            {settings.creativity >= 70 && "Wild and imaginative"}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-card border-border/50 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-accent" />
            <Label className="font-medium">Emotion</Label>
          </div>
          <Slider
            value={[settings.emotion]}
            onValueChange={(value) => onSettingsChange({ ...settings, emotion: value[0] })}
            max={100}
            step={1}
            className="mb-2"
          />
          <p className="text-xs text-muted-foreground">
            {settings.emotion < 40 && "Calm and rational"}
            {settings.emotion >= 40 && settings.emotion < 70 && "Moderately expressive"}
            {settings.emotion >= 70 && "Highly emotional and empathetic"}
          </p>
        </Card>

        <Card className="p-4 bg-gradient-card border-border/50 shadow-soft">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-4 w-4 text-primary" />
            <Label className="font-medium">Verbosity</Label>
          </div>
          <Slider
            value={[settings.verbosity]}
            onValueChange={(value) => onSettingsChange({ ...settings, verbosity: value[0] })}
            max={100}
            step={1}
            className="mb-2"
          />
          <p className="text-xs text-muted-foreground">
            {settings.verbosity < 40 && "Brief and concise"}
            {settings.verbosity >= 40 && settings.verbosity < 70 && "Balanced responses"}
            {settings.verbosity >= 70 && "Detailed and elaborate"}
          </p>
        </Card>

        <div className="pt-4 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            These settings adjust how your character responds. Changes apply to new messages.
          </p>
        </div>
      </div>
    </div>
  );
};
