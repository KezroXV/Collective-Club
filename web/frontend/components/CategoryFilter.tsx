"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Filter,
  Search,
  Plus,
  ChevronDown,
  Share2,
  Wrench,
  Clock,
  Calendar,
  Heart,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const CATEGORIES = [
  {
    id: "all",
    name: "Tout",
    color: "bg-gray-400",
    count: 0,
  },
  {
    id: "maison",
    name: "Maison",
    color: "bg-orange-500",
    count: 5,
  },
  {
    id: "tech",
    name: "Tech",
    color: "bg-green-500",
    count: 8,
  },
  {
    id: "artisanat",
    name: "Artisanat",
    color: "bg-pink-500",
    count: 3,
  },
  {
    id: "voyage",
    name: "Voyage",
    color: "bg-blue-500",
    count: 12,
  },
  {
    id: "cosmetique",
    name: "Cosmétique",
    color: "bg-purple-500",
    count: 6,
  },
  {
    id: "revente",
    name: "Revente",
    color: "bg-yellow-500",
    count: 4,
  },
];

const SORT_OPTIONS = [
  {
    value: "newest",
    label: "Nouveau",
    icon: Clock,
  },
  {
    value: "oldest",
    label: "Plus ancien",
    icon: Calendar,
  },
  {
    value: "popular",
    label: "Plus likés",
    icon: Heart,
  },
];

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onSearch: (query: string) => void;
  onCreatePost: () => void;
  sortBy?: string;
  onSortChange?: (sort: string) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  onSearch,
  onCreatePost,
  sortBy = "newest",
  onSortChange,
}: CategoryFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const MAX_VISIBLE = 7;

  const visibleCategories = CATEGORIES.slice(0, MAX_VISIBLE);
  const overflowCategories = CATEGORIES.slice(MAX_VISIBLE);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const currentSortLabel =
    SORT_OPTIONS.find((option) => option.value === sortBy)?.label || "Nouveau";

  return (
    <div className="bg-white">
      <div className="container mx-auto px-6">
        {/* Top Row: Filter + Search + Create Button */}
        <div className="flex items-center gap-6 py-6">
          {/* Bouton Filtrer avec dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="gap-3 text-base px-6 py-3 h-auto rounded-2xl border-gray-300 bg-white hover:bg-gray-50 transition-all font-medium"
              >
                <Filter className="h-4 w-4" />
                Filtrer
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Trier par
              </DropdownMenuLabel>
              {SORT_OPTIONS.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange?.(option.value)}
                  className="flex items-center gap-3 py-2"
                >
                  <option.icon className="h-4 w-4 text-gray-500" />
                  <span className="flex-1">{option.label}</span>
                  {sortBy === option.value && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </DropdownMenuItem>
              ))}

              {overflowCategories.map((category) => (
                <DropdownMenuItem
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className="flex items-center gap-3 py-2"
                >
                  <span
                    className={`w-3 h-3 rounded-full ${category.color}`}
                  ></span>
                  <span className="flex-1">{category.name}</span>
                  {selectedCategory === category.id && (
                    <Check className="h-4 w-4 text-blue-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Rechercher par nom ou par post..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-14 h-14 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-2xl text-base bg-white"
            />
          </div>

          <Button
            onClick={onCreatePost}
            className="bg-blue-600 hover:bg-blue-700 text-white gap-3 px-8 py-4 h-auto rounded-2xl shadow-sm font-medium text-base"
          >
            Créer un post
            <div className="bg-white rounded-full p-1">
              <Plus className="h-4 w-4 text-black" />
            </div>
          </Button>
        </div>

        {/* Categories Row */}
        <div className="flex items-center gap-3 pb-4 flex-nowrap">
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl whitespace-nowrap transition-all text-sm font-medium border ${
                selectedCategory === category.id
                  ? "bg-white text-gray-900 border-gray-300 ring-2 ring-blue-300"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              <span>{category.name}</span>
            </button>
          ))}

          {/* Voir plus - maintenant juste pour les catégories supplémentaires */}
          {overflowCategories.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2.5 whitespace-nowrap text-sm px-5 py-2 h-auto rounded-2xl border border-gray-300 bg-white hover:bg-gray-50 font-medium"
                >
                  Voir plus
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {overflowCategories.map((category) => (
                  <DropdownMenuItem
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`flex items-center gap-2 ${
                      selectedCategory === category.id ? "text-blue-700" : ""
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${category.color}`}
                    ></span>
                    {category.name}
                    {selectedCategory === category.id && (
                      <Check className="h-4 w-4 ml-auto text-blue-600" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Status indicator pour le tri actuel */}
          <div className="flex items-center gap-2 ml-auto text-sm text-gray-500">
            <span>Trié par:</span>
            <span className="font-medium text-gray-700">
              {currentSortLabel}
            </span>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
            >
              <Wrench className="h-4 w-4 text-gray-500" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0 rounded-full bg-white border border-gray-300 hover:bg-gray-50"
            >
              <Share2 className="h-4 w-4 text-gray-500" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
