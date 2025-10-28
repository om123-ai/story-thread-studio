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
  "Patient Teacher",
  "Code Optimizer",
  "Debug Expert",
  "Creative Problem Solver",
  "Best Practices Advocate",
  "Performance Focused",
  "Security Conscious",
  "Documentation Lover",
  "TDD Enthusiast",
  "Agile Coach",
  "Quick Responder",
  "Detailed Explainer",
];
const CATEGORIES = ["Frontend", "Backend", "Full-Stack", "AI/ML", "Mobile", "DevOps", "Data Science"];

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
    category: "Full-Stack",
    tags: [] as string[],
    creativity: 50,
    emotion: 50,
    memory: 50,
    imageUrl: null as string | null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleTag = (tag: string) => {
    setCharacterData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
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

      const { error: uploadError, data } = await supabase.storage
        .from('character-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('character-images')
        .getPublicUrl(filePath);

      setCharacterData({ ...characterData, imageUrl: publicUrl });
      setImagePreview(publicUrl);
      setErrors({ ...errors, imageUrl: "" });
      
      toast({
        title: "Image uploaded",
        description: "Your character image has been uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      setErrors({ ...errors, imageUrl: "Failed to upload image" });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setCharacterData({ ...characterData, imageUrl: null });
  };

  const handleCreate = async () => {
    // Validate inputs
    const newErrors: Record<string, string> = {};
    
    if (!characterData.name || characterData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    if (characterData.name.length > 50) {
      newErrors.name = "Name must be less than 50 characters";
    }
    if (!characterData.description || characterData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    if (characterData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    if (characterData.tags.length > 5) {
      newErrors.tags = "Maximum 5 personality traits allowed";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: "Validation Error",
        description: "Please fix the errors before creating your character",
        variant: "destructive",
      });
      return;
    }

    setErrors({});
    
    try {
      await createCharacter.mutateAsync({
        name: characterData.name,
        description: characterData.description,
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
      toast({
        title: "Creation Failed",
        description: "Failed to create character. Please try again.",
        variant: "destructive",
      });
    }
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
              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Character Image</Label>
                {imagePreview ? (
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Character preview" 
                      className="w-full h-48 object-cover rounded-xl"
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
                    setErrors({ ...errors, name: "" });
                  }}
                  placeholder="Enter character name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Expertise Area</Label>
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
                  onChange={(e) => {
                    setCharacterData({ ...characterData, description: e.target.value });
                    setErrors({ ...errors, description: "" });
                  }}
                  placeholder="Describe your coding assistant's expertise and teaching style..."
                  rows={4}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Personality Traits (max 5)</Label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => (
                    <Badge
                      key={tag}
                      variant={characterData.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => {
                        if (characterData.tags.length >= 5 && !characterData.tags.includes(tag)) {
                          toast({
                            title: "Maximum reached",
                            description: "You can select up to 5 traits",
                            variant: "destructive",
                          });
                          return;
                        }
                        toggleTag(tag);
                        setErrors({ ...errors, tags: "" });
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Code Creativity: {characterData.creativity}%</Label>
                  <p className="text-xs text-muted-foreground">Conservative vs Experimental approaches</p>
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
                  <Label>Empathy: {characterData.emotion}%</Label>
                  <p className="text-xs text-muted-foreground">Patience level and teaching style</p>
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
                  <Label>Context Awareness: {characterData.memory}%</Label>
                  <p className="text-xs text-muted-foreground">Project context retention</p>
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
                {imagePreview ? (
                  <img 
                    src={imagePreview} 
                    alt="Character preview"
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
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