/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MessageSquare, Share2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import CreatePostModal from "@/components/CreatePostModal";
import { toast } from "sonner";
import PollDisplay from "@/components/PollDisplay";
import ReactionPicker from "@/components/ReactionPicker";

interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  category?: {
    id: string;
    name: string;
    color: string;
  };
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  poll?: {
    id: string;
    question: string;
    options: Array<{
      id: string;
      text: string;
      order: number;
      _count: { votes: number };
    }>;
    _count: { votes: number };
  } | null;
  _count: {
    comments: number;
    reactions: number;
  };
  createdAt: string;
}

<<<<<<< HEAD
const CATEGORIES = [
  { id: "all", name: "Tout", color: "bg-gray-400", count: 0 },
  { id: "maison", name: "Maison", color: "bg-orange-500", count: 5 },
  { id: "tech", name: "Tech", color: "bg-green-500", count: 8 },
  { id: "artisanat", name: "Artisanat", color: "bg-pink-500", count: 3 },
  { id: "voyage", name: "Voyage", color: "bg-primary", count: 12 },
  { id: "cosmetique", name: "Cosmétique", color: "bg-purple-500", count: 6 },
  { id: "revente", name: "Revente", color: "bg-yellow-500", count: 4 },
];

=======
>>>>>>> de7090021793ae38ee7dd965169c7481e297a6a7
export default function HomePage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState("newest");
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
  // Modifier le filtering par catégorie :
  useEffect(() => {
    // Toujours cloner pour éviter les mutations in-place qui bloquent le re-render
    let filtered = [...posts];

    // Filter by category - CORRIGÉ
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (post) => post.category?.id === selectedCategory
      );
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

    // Sort posts (sur une copie)
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "popular":
          const aReactions = a._count?.reactions || 0;
          const bReactions = b._count?.reactions || 0;
          return bReactions - aReactions;
        default:
          return 0;
      }
    });

    // Toujours setter une nouvelle référence
    setFilteredPosts(sorted);
  }, [posts, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
<<<<<<< HEAD
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
=======
      <Header currentUser={currentUser ?? undefined} />

      {/* Hero Banner */}
      <HeroBanner />
>>>>>>> de7090021793ae38ee7dd965169c7481e297a6a7
      {/* Section unifiée: Filtres + Posts */}
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto rounded-[22px] border border-primary/20 bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSearch={setSearchQuery}
                onCreatePost={() => setShowCreateModal(true)}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
              {/* Séparateur entre filtres et posts */}
              <div className="w-full h-px bg-gray-200 mb-6"></div>

<<<<<<< HEAD
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
=======
              {/* Posts Content */}
              <div className="space-y-0">
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
>>>>>>> de7090021793ae38ee7dd965169c7481e297a6a7
                    )}
                  </div>
<<<<<<< HEAD
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
=======
                ) : (
                  filteredPosts.map((post, index) => (
                    <div
                      key={post.id}
                      className={`pb-8 ${
                        index !== filteredPosts.length - 1
                          ? "border-b border-gray-100"
                          : ""
                      }`}
                    >
                      {/* Post Title and Content */}
                      <div className="mb-6 pl-16">
                        <h2 className="text-[17px] md:text-[18px] font-semibold text-gray-900 mb-2 leading-tight line-clamp-1">
                          {post.title}
                        </h2>
                        <p className="text-gray-700 text-[14px] leading-6 line-clamp-2">
                          {post.content}
                        </p>
>>>>>>> de7090021793ae38ee7dd965169c7481e297a6a7
                      </div>

                      {/* Post Image */}
                      {post.imageUrl && (
                        <div className="mb-8 pl-16">
                          <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                            <Image
                              src={post.imageUrl}
                              alt={post.title}
                              width={1600}
                              height={900}
                              className="w-full h-auto max-h-96 object-cover"
                            />
                          </div>
                        </div>
                      )}

                      {/* Poll */}
                      {post.poll && (
                        <div className="mb-8 pl-16">
                          <PollDisplay
                            poll={post.poll}
                            currentUser={currentUser ?? undefined}
                            onVote={() => fetchPosts()}
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 pl-16">
                        <ReactionPicker
                          postId={post.id}
                          currentUserId={currentUser?.id || ""}
                          onReactionUpdate={fetchPosts}
                        />

<<<<<<< HEAD
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
=======
                        <Link
                          href={`/community?postId=${post.id}`}
                          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors group"
                        >
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-gray-200 group-hover:bg-primary/10 group-hover:border-primary/30 text-gray-600"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <Badge className="rounded-full bg-white text-gray-600 border border-gray-200 px-2 py-0 text-xs font-medium">
                              {post._count.comments}
                            </Badge>
                          </Button>
                        </Link>
>>>>>>> de7090021793ae38ee7dd965169c7481e297a6a7

                        <Button
                          variant="outline"
                          className="ml-auto flex items-center gap-2 bg-white px-4 py-2 rounded-full border-gray-200 hover:bg-gray-100 text-gray-600"
                          onClick={() => {
                            const url = `${window.location.origin}/community/${post.id}`;
                            navigator.clipboard.writeText(url);
                            toast.success(
                              "Lien copié dans le presse-papiers !"
                            );
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                          Partager
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        currentUser={currentUser}
        onPostCreated={fetchPosts}
      />
    </div>
  );
}
