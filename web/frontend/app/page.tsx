/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Settings,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  _count: {
    comments: number;
    reactions: number;
  };
  createdAt: string;
}

export default function HomePage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    activeToday: 0,
  });

  const searchParams = useSearchParams();

  // ✅ Détecter l'auth Shopify et créer l'user
  useEffect(() => {
    const shop = searchParams.get("shop");
    const hmac = searchParams.get("hmac");

    if (shop && hmac) {
      console.log("🔥 Shopify auth detected for shop:", shop);
      createOrUpdateUser(shop);
    }
  }, [searchParams]);

  // ✅ Créer/récupérer l'user
  const createOrUpdateUser = async (shop: string) => {
    try {
      console.log("🔥 Creating user for shop:", shop);

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

        // ✅ NOUVEAU : Stocker dans localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));

        console.log("✅ User created/updated:", user.id);
      }
    } catch (error) {
      console.error("❌ Error creating user:", error);
    }
  };

  // ✅ Récupérer les posts
  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);

      // Calculer les stats
      setStats({
        totalPosts: data.length,
        totalUsers: new Set(data.map((p: Post) => p.author.email)).size,
        activeToday: data.filter((p: Post) => {
          const today = new Date().toDateString();
          const postDate = new Date(p.createdAt).toDateString();
          return today === postDate;
        }).length,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // ✅ Handler pour créer un post
  const handleCreatePost = (): void => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  // Récupérer les stats depuis l'API
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Collective Club
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
              Forum communautaire pour votre boutique Shopify
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin">
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </Button>
            </Link>
            <Link href="/community">
              <Button
                disabled={loading}
                className="gap-2"
                onClick={handleCreatePost}
              >
                <Plus className="h-4 w-4" />
                {loading ? "Chargement..." : "Créer un post"}
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Card */}
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                  🎉 Votre forum est maintenant connecté !
                </CardTitle>
                <CardDescription className="text-base">
                  Base de données PostgreSQL + Prisma + API routes
                  fonctionnelles
                  {currentUser && (
                    <span className="block mt-1 text-green-600">
                      ✅ Utilisateur connecté: {currentUser.name}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">✅ Terminé :</h3>
                    <div className="space-y-2">
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        ✅ Auth Shopify + DB
                      </Badge>
                      <br />
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        ✅ API Posts/Users
                      </Badge>
                      <br />
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 border-green-200"
                      >
                        ✅ Interface moderne
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg">
                      🔄 Prochainement :
                    </h3>
                    <div className="space-y-2">
                      <Badge variant="secondary">🔄 CRUD complet</Badge>
                      <br />
                      <Badge variant="secondary">🔄 Upload images</Badge>
                      <br />
                      <Badge variant="secondary">🔄 Réactions</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Link href="/community">
                    <Button variant="outline" className="w-full group">
                      Tester le forum maintenant
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Posts */}
            {posts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Posts récents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {posts.slice(0, 3).map((post) => (
                      <div
                        key={post.id}
                        className="border-l-4 border-primary/20 pl-4"
                      >
                        <h4 className="font-semibold">{post.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Par {post.author.name} • {post._count.comments}{" "}
                          commentaires
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Statistiques en temps réel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <MessageSquare className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Posts</span>
                      <p className="text-xs text-muted-foreground">
                        Total publié
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg font-bold">
                    {stats.totalPosts}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Membres</span>
                      <p className="text-xs text-muted-foreground">Inscrits</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg font-bold">
                    {stats.totalUsers}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <span className="text-sm font-medium">Actifs</span>
                      <p className="text-xs text-muted-foreground">
                        Aujourd&apos;hui
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-lg font-bold">
                    {stats.activeToday}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progression du projet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Phase 1: Fondations</span>
                    <span className="font-semibold">90%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[90%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Phase 2: Forum</span>
                    <span className="font-semibold">20%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full w-[20%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
