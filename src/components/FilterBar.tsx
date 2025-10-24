import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const FilterBar = ({ 
  categories, 
  activeCategory, 
  onCategoryChange,
  searchQuery,
  onSearchChange 
}: FilterBarProps) => {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search characters..."
          className="pl-12 h-12 glass-effect border-border/50 text-foreground placeholder:text-muted-foreground rounded-2xl"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <Button
            key={category}
            onClick={() => onCategoryChange(category)}
            variant={activeCategory === category ? "default" : "ghost"}
            className={cn(
              "flex-shrink-0 rounded-full",
              activeCategory === category 
                ? "bg-gradient-primary shadow-glow" 
                : "glass-effect hover:bg-muted"
            )}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};
