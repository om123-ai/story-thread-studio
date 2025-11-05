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
import { Loader2, Sparkles, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const TAG_OPTIONS = [
  "Frontend",
  "Backend",
  "Full-Stack",
  "AI/ML",
  "Mobile Dev",
  "DevOps",
  "Database Expert",
  "UI/UX",
  "Security",
  "Performance",
  "Cloud",
  "Testing",
];
const CATEGORIES = ["Coding", "Debug", "Design", "Architecture", "Learning", "Code Review"];

const Create = () => {
  const navigate = useNavigate();
  const createCharacter = useCreateCharacter();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [characterData, setCharacterData] = useState({
    name: "",
    description: "",
    avatar: "💻",
    category: "Coding",
    tags: [] as string[],
    creativity: 50,
    emotion: 50,
    memory: 50,
    imageUrl: null as string | null,
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const toggleTag = (tag: string) => {
    setCharacterData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!characterData.name.trim()) {
      errors.name = "Name is required";
    } else if (characterData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    } else if (characterData.name.trim().length > 50) {
      errors.name = "Name must be less than 50 characters";
    }

    if (!characterData.description.trim()) {
      errors.description = "Description is required";
    } else if (characterData.description.trim().length < 20) {
      errors.description = "Description must be at least 20 characters";
    } else if (characterData.description.trim().length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    if (characterData.tags.length > 5) {
      errors.tags = "Maximum 5 tags allowed";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file format",
        description: "Please upload a JPEG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('character-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('character-images')
        .getPublicUrl(filePath);

      setCharacterData({ ...characterData, imageUrl: publicUrl });
      setImagePreview(publicUrl);
      
      toast({
        title: "Image uploaded",
        description: "Your character image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setCharacterData({ ...characterData, imageUrl: null });
  };

  const handleCreate = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before creating the character",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCharacter.mutateAsync({
        name: characterData.name.trim(),
        description: characterData.description.trim(),
        avatar: characterData.avatar,
        category: characterData.category,
        tags: characterData.tags,
        creativity: characterData.creativity,
        emotion: characterData.emotion,
        memory: characterData.memory,
        imageUrl: characterData.imageUrl,
      });

      navigate("/discover");
    } catch (error) {
      console.error('Character creation error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <Card className="p-8 glass-effect border-border/50 hover-glow">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-cyber bg-clip-text text-transparent">
              Create AI Assistant
            </h1>

            <div className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Character Image</Label>
                {imagePreview ? (
                  <div className="relative">
                  <img 
                    src={imagePreview} 
                    alt="Character preview" 
                    className="w-full h-48 object-cover object-center rounded-xl"
                  />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-muted/50 transition-colors">
                    <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">
                      {uploading ? "Uploading..." : "Click to upload image"}
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                )}
              </div>

              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={characterData.name}
                  onChange={(e) => {
                    setCharacterData({ ...characterData, name: e.target.value });
                    setValidationErrors({ ...validationErrors, name: "" });
                  }}
                  placeholder="Enter assistant name"
                  className={validationErrors.name ? "border-destructive" : ""}
                />
                {validationErrors.name && (
                  <p className="text-xs text-destructive">{validationErrors.name}</p>
                )}
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
                <Label htmlFor="description">Description & Expertise</Label>
                <Textarea
                  id="description"
                  value={characterData.description}
                  onChange={(e) => {
                    setCharacterData({ ...characterData, description: e.target.value });
                    setValidationErrors({ ...validationErrors, description: "" });
                  }}
                  placeholder="Describe the AI assistant's expertise and personality..."
                  rows={4}
                  className={validationErrors.description ? "border-destructive" : ""}
                />
                {validationErrors.description && (
                  <p className="text-xs text-destructive">{validationErrors.description}</p>
                )}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Specialization Tags (Max 5)</Label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={characterData.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-all duration-300 hover:shadow-glow"
                      onClick={() => {
                        if (characterData.tags.length >= 5 && !characterData.tags.includes(tag)) {
                          toast({
                            title: "Maximum tags reached",
                            description: "You can select up to 5 tags",
                            variant: "destructive",
                          });
                          return;
                        }
                        toggleTag(tag);
                        setValidationErrors({ ...validationErrors, tags: "" });
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {validationErrors.tags && (
                  <p className="text-xs text-destructive">{validationErrors.tags}</p>
                )}
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Code Creativity: {characterData.creativity}%</Label>
                  <p className="text-xs text-muted-foreground">How experimental vs conservative the solutions are</p>
                  <Slider
                    value={[characterData.creativity]}
                    onValueChange={([value]) =>
                      setCharacterData({ ...characterData, creativity: value })
                    }
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Empathy: {characterData.emotion}%</Label>
                  <p className="text-xs text-muted-foreground">Patience level and teaching style</p>
                  <Slider
                    value={[characterData.emotion]}
                    onValueChange={([value]) =>
                      setCharacterData({ ...characterData, emotion: value })
                    }
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Context Awareness: {characterData.memory}%</Label>
                  <p className="text-xs text-muted-foreground">Project context retention ability</p>
                  <Slider
                    value={[characterData.memory]}
                    onValueChange={([value]) =>
                      setCharacterData({ ...characterData, memory: value })
                    }
                    max={100}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>
              </div>

              <Button
                onClick={handleCreate}
                disabled={createCharacter.isPending}
                className="w-full bg-gradient-primary shadow-glow hover:shadow-glow-pink transition-all duration-300 hover:scale-[1.02]"
              >
                {createCharacter.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Assistant...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create AI Assistant
                  </>
                )}
              </Button>
            </div>
          </Card>

          {/* Live Preview */}
          <Card className="p-8 glass-effect border-border/50 sticky top-24 h-fit neon-border">
            <h2 className="text-xl font-semibold mb-6 bg-gradient-secondary bg-clip-text text-transparent">Live Preview</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Character preview"
                    className="w-20 h-20 rounded-2xl object-cover object-center"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-cyber flex items-center justify-center">
                    <Upload className="w-8 h-8 text-white" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">
                    {characterData.name || "AI Assistant Name"}
                  </h3>
                  <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground">{characterData.category}</Badge>
                </div>
              </div>

              <p className="text-muted-foreground">
                {characterData.description || "AI assistant expertise and description will appear here..."}
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
                  <span className="text-muted-foreground">Code Creativity</span>
                  <span className="font-medium text-primary">{characterData.creativity}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Empathy</span>
                  <span className="font-medium text-secondary">{characterData.emotion}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Context Awareness</span>
                  <span className="font-medium text-accent">{characterData.memory}%</span>
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