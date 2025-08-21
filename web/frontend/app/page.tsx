/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MessageSquare,
  Heart,
  Share2,
  MoreHorizontal,
  Filter,
  Search,
  Plus,
} from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category?: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  _count: {
    comments: number;
    reactions: number;
  };
  createdAt: string;
}

const CATEGORIES = [
  { id: "all", name: "Tout", color: "bg-gray-400", count: 0 },
  { id: "maison", name: "Maison", color: "bg-orange-500", count: 5 },
  { id: "tech", name: "Tech", color: "bg-green-500", count: 8 },
  { id: "artisanat", name: "Artisanat", color: "bg-pink-500", count: 3 },
  { id: "voyage", name: "Voyage", color: "bg-primary", count: 12 },
  { id: "cosmetique", name: "Cosmétique", color: "bg-purple-500", count: 6 },
  { id: "revente", name: "Revente", color: "bg-yellow-500", count: 4 },
];

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const searchParams = useSearchParams();

  // Auth user detection
  useEffect(() => {
    const shop = searchParams.get("shop");
    const hmac = searchParams.get("hmac");

    if (shop && hmac) {
      console.log("🔥 Shopify auth detected for shop:", shop);
      createOrUpdateUser(shop);
    } else {
      // Load from localStorage
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
    }
  }, [searchParams]);

  // Create/update user
  const createOrUpdateUser = async (shop: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: `admin@${shop}`,
          name: `Admin de ${shop}`,
          shopDomain: shop,
        }),
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        localStorage.setItem("currentUser", JSON.stringify(user));
        console.log("✅ User created/updated:", user.id);
      }
    } catch (error) {
      console.error("❌ Error creating user:", error);
    }
  };

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
      setFilteredPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Filter posts
  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.author.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [posts, selectedCategory, searchQuery]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?"
    );
  };

  const getCategoryColor = (category: string) => {
    const categoryObj = CATEGORIES.find((c) => c.id === category);
    return categoryObj?.color || "bg-gray-500";
  };

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      maison: "Maison",
      tech: "Tech",
      artisanat: "Artisanat",
      voyage: "Voyage",
      cosmetique: "Cosmétique",
      revente: "Revente",
    };
    return names[category] || "Général";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="font-semibold text-lg text-gray-900">
                Collective Club
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-1">
              <Button
                variant="default"
                className="bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-full"
              >
                Accueil
              </Button>
              <Link href="/community">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full"
                >
                  Post
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full"
                >
                  Dashboard
                </Button>
              </Link>
              <Link href="/profile">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-full"
                >
                  Profil
                </Button>
              </Link>
            </nav>

            {/* User Avatar */}
            {currentUser && (
              <Avatar className="h-8 w-8 ring-2 ring-gray-200">
                <AvatarFallback className="bg-gray-500 text-white text-sm">
                  {getInitials(currentUser.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="relative h-40 bg-gradient-to-br from-primary via-primary to-secondary overflow-hidden">
        {/* Formes géométriques diagonales */}
        <div className="absolute inset-0">
          {/* Grande forme diagonale gauche */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-black/20 transform rotate-45"></div>
          {/* Forme diagonale droite */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-black/15 transform rotate-45"></div>
          {/* Forme centrale */}
          <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-secondary/20 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
          {/* Petites formes d'accent */}
          <div className="absolute top-8 right-32 w-12 h-12 bg-accent/20 transform rotate-45"></div>
          <div className="absolute bottom-8 left-32 w-8 h-8 bg-secondary/30 transform rotate-45"></div>
        </div>

        {/* Overlay gradient pour plus de profondeur */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20"></div>

        {/* Content */}
        <div className="relative container mx-auto px-6 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Forum Communautaire
            </h1>
            <p className="text-primary/20 text-base opacity-90">
              Partagez vos idées et discutez avec la communauté
            </p>
          </div>
        </div>
      </div>
      {/* Section unifiée: Filtres + Posts */}
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Top Row: Filter + Search + Create Button */}
            <div className="flex items-center gap-6 mb-8">
              <Button
                variant="outline"
                className="gap-2 text-sm px-5 py-2.5 h-auto border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                Filtrer
              </Button>

              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher par nom ou par post..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-11 border-gray-300 focus:border-primary focus:ring-primary rounded-lg text-sm"
                />
              </div>

              <Link href="/community">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-6 py-2.5 h-11 rounded-lg shadow-sm">
                  <Plus className="h-4 w-4" />
                  Créer un post
                </Button>
              </Link>
            </div>

            {/* Categories Row avec ligne de séparation */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4 overflow-x-auto pb-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2.5 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                      selectedCategory === category.id
                        ? "bg-primary/10 border border-primary/30 text-primary shadow-sm"
                        : "hover:bg-gray-50 border border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${category.color}`}
                    ></div>
                    <span>{category.name}</span>
                    {category.count > 0 && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full min-w-[22px] text-center font-medium">
                        {category.count}
                      </span>
                    )}
                  </button>
                ))}

                {/* Add More Button */}
                <Button
                  variant="outline"
                  className="gap-2 whitespace-nowrap text-sm px-4 py-2 h-auto border-dashed border-gray-300 rounded-full hover:bg-gray-50"
                >
                  Voir plus
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              {/* Ligne de séparation avec indicateur de scroll */}
              <div className="relative">
                <div className="w-full h-px bg-gray-200"></div>
                {/* Petites flèches de navigation */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -ml-2">
                  <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 border-l border-b border-gray-600 transform rotate-45"></div>
                  </div>
                </div>
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-2">
                  <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 border-r border-b border-gray-600 transform -rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts Content */}
            <div className="space-y-12">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-24">
                  <div className="text-gray-400 mb-8">
                    <MessageSquare className="h-24 w-24 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    {searchQuery || selectedCategory !== "all"
                      ? "Aucun post trouvé"
                      : "Aucun post pour l'instant"}
                  </h3>
                  <p className="text-gray-600 mb-10 text-lg leading-relaxed max-w-md mx-auto">
                    {searchQuery || selectedCategory !== "all"
                      ? "Essayez de modifier vos filtres de recherche"
                      : "Soyez le premier à partager quelque chose !"}
                  </p>
                  {currentUser && (
                    <Link href="/community">
                      <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg rounded-lg shadow-sm">
                        Créer le premier post
                      </Button>
                    </Link>
                  )}
                </div>
              ) : (
                filteredPosts.map((post, index) => (
                  <div
                    key={post.id}
                    className={`pb-12 ${
                      index !== filteredPosts.length - 1
                        ? "border-b border-gray-100"
                        : ""
                    }`}
                  >
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-13 w-13 ring-3 ring-gray-100 ring-offset-1">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-lg">
                            {getInitials(post.author.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900 text-base leading-tight">
                            {post.author.name}
                          </p>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-10 w-10 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Post Title and Content */}
                    <div className="mb-8 pl-16">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4 leading-tight">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 text-base leading-relaxed">
                        {post.content}
                      </p>
                    </div>

                    {/* Post Image */}
                    {post.imageUrl && (
                      <div className="mb-8 pl-16">
                        <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                          <img
                            src={post.imageUrl}
                            alt={post.title}
                            className="w-full h-auto max-h-96 object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center gap-8 pl-16">
                      <button className="flex items-center gap-3 text-gray-500 hover:text-red-500 transition-colors group">
                        <div className="flex items-center gap-2 bg-gray-50 group-hover:bg-red-50 px-4 py-2.5 rounded-full transition-all border border-gray-200 group-hover:border-red-200">
                          <Heart className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {post._count.reactions}
                          </span>
                        </div>
                      </button>

                      <Link
                        href={`/community?postId=${post.id}`}
                        className="flex items-center gap-3 text-gray-500 hover:text-primary transition-colors group"
                      >
                        <div className="flex items-center gap-2 bg-gray-50 group-hover:bg-primary/10 px-4 py-2.5 rounded-full transition-all border border-gray-200 group-hover:border-primary/30">
                          <MessageSquare className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {post._count.comments}
                          </span>
                        </div>
                      </Link>

                      <button className="flex items-center gap-3 text-gray-500 hover:text-gray-700 transition-colors group ml-auto">
                        <div className="flex items-center gap-2 bg-gray-50 group-hover:bg-gray-100 px-4 py-2.5 rounded-full transition-all border border-gray-200 group-hover:border-gray-300">
                          <Share2 className="h-4 w-4" />
                          <span className="text-sm">Partager</span>
                        </div>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
