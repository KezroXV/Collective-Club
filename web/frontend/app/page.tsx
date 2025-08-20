/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Share2, MoreHorizontal, Heart } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryFilter from "@/components/CategoryFilter";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

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

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header currentUser={currentUser ?? undefined} />

      {/* Hero Banner */}
      <HeroBanner />
      {/* Section unifiée: Filtres + Posts */}
      <div className="bg-white min-h-screen">
        <div className="container mx-auto px-6 py-8">
          <div className="max-w-4xl mx-auto rounded-[22px] border border-blue-100 bg-white shadow-sm overflow-hidden">
            <div className="p-6">
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                onSearch={setSearchQuery}
                onCreatePost={() => router.push("/community")}
              />

              {/* Séparateur entre filtres et posts */}
              <div className="w-full h-px bg-gray-200 mb-6"></div>

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
                        <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg rounded-lg shadow-sm">
                          Créer le premier post
                        </Button>
                      </Link>
                    )}
                  </div>
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
                      {/* Post Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                            <AvatarImage src={post.author.avatar} />
                            <AvatarFallback className="bg-blue-600 text-white font-semibold text-lg">
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
                      <div className="mb-6 pl-16">
                        <h2 className="text-[17px] md:text-[18px] font-semibold text-gray-900 mb-2 leading-tight line-clamp-1">
                          {post.title}
                        </h2>
                        <p className="text-gray-700 text-[14px] leading-6 line-clamp-2">
                          {post.content}
                        </p>
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

                      {/* Post Actions */}
                      <div className="flex items-center gap-6 pl-16">
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-600 hover:text-red-600"
                        >
                          <Heart className="h-4 w-4" />
                          <Badge className="rounded-full bg-white text-gray-600 border border-gray-200 px-2 py-0 text-xs font-medium">
                            {post._count.reactions}
                          </Badge>
                        </Button>

                        <Link
                          href={`/community?postId=${post.id}`}
                          className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors group"
                        >
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border-gray-200 group-hover:bg-blue-50 group-hover:border-blue-200 text-gray-600"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <Badge className="rounded-full bg-white text-gray-600 border border-gray-200 px-2 py-0 text-xs font-medium">
                              {post._count.comments}
                            </Badge>
                          </Button>
                        </Link>

                        <Button
                          variant="outline"
                          className="ml-auto flex items-center gap-2 bg-white px-4 py-2 rounded-full border-gray-200 hover:bg-gray-100 text-gray-600"
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
    </div>
  );
}
