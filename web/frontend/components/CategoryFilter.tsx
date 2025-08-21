"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, Plus } from "lucide-react";

const CATEGORIES = [
  {
    id: "all",
    name: "Tout",
    color: "bg-gray-400",
    textColor: "text-gray-700",
    count: 0,
    selected: true,
  },
  {
    id: "maison",
    name: "Maison",
    color: "bg-orange-500",
    textColor: "text-orange-700",
    count: 5,
  },
  {
    id: "tech",
    name: "Tech",
    color: "bg-green-500",
    textColor: "text-green-700",
    count: 8,
  },
  {
    id: "artisanat",
    name: "Artisanat",
    color: "bg-pink-500",
    textColor: "text-pink-700",
    count: 3,
  },
  {
    id: "voyage",
    name: "Voyage",
    color: "bg-primary",
    textColor: "text-primary",
    count: 12,
  },
  {
    id: "cosmetique",
    name: "Cosmétique",
    color: "bg-purple-500",
    textColor: "text-purple-700",
    count: 6,
  },
  {
    id: "revente",
    name: "Revente",
    color: "bg-yellow-500",
    textColor: "text-yellow-700",
    count: 4,
  },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  onCreatePost: () => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  onSearch,
  onCreatePost,
}: CategoryFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-6">
        {/* Top Row: Filter + Search + Create Button */}
        <div className="flex items-center gap-4 py-4">
          <Button variant="outline" className="gap-2 text-sm px-4 py-2 h-auto">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher par nom ou par post..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 h-10 border-gray-200 focus:border-primary focus:ring-primary"
            />
          </div>

          <Button
            onClick={onCreatePost}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-4 py-2 h-10"
          >
            <Plus className="h-4 w-4" />
            Créer un post
          </Button>
        </div>

        {/* Categories Row */}
        <div className="flex items-center gap-2 pb-4 overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full whitespace-nowrap transition-all text-sm border ${
                selectedCategory === category.id
                  ? "bg-primary/10 border-primary text-primary shadow-sm"
                  : "hover:bg-gray-50 border-gray-200 text-gray-600"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              <span className="font-medium">{category.name}</span>
              {category.count > 0 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {category.count}
                </span>
              )}
            </button>
          ))}

          {/* Add More Button */}
          <Button
            variant="outline"
            className="gap-1 whitespace-nowrap text-sm px-3 py-1.5 h-auto border-dashed"
          >
            Voir plus
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
