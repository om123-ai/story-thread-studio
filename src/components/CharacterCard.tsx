import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CharacterCardProps {
  name: string;
  description: string;
  avatar: string;
  tags: string[];
  messageCount?: number;
  onClick: () => void;
}

export const CharacterCard = ({ 
  name, 
  description, 
  avatar, 
  tags, 
  messageCount,
  onClick 
}: CharacterCardProps) => {
  return (
    <Card 
      className="group cursor-pointer overflow-hidden hover:shadow-medium transition-all duration-300 hover:scale-105 bg-gradient-card border-border/50"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="absolute inset-0 flex items-center justify-center text-6xl">
            {avatar}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-card/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {description}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag, idx) => (
              <Badge 
                key={idx} 
                variant="secondary" 
                className="text-xs bg-secondary/50 hover:bg-secondary"
              >
                {tag}
              </Badge>
            ))}
          </div>
          {messageCount !== undefined && (
            <div className="text-xs text-muted-foreground pt-2 border-t border-border/30">
              {messageCount.toLocaleString()} conversations
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
