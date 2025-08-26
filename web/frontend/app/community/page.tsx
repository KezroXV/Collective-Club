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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Plus, Search, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";
import ReactionPicker from "@/components/ReactionPicker";
import PollDisplay from "@/components/PollDisplay";
import ThemeWrapper from "@/components/ThemeWrapper";
import { MobileNavigation } from "@/components/ui/mobile-drawer";
import { LoadingState, LoadingCard } from "@/components/ui/loading";
import {
  StaggeredList,
  AnimatedContainer,
} from "@/components/ui/animated-container";
interface Post {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: {
    id: string;
    name: string;
    email: string;
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

interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const searchParams = useSearchParams();

  // Remplacer l'useEffect currentUser par :
  useEffect(() => {
    // 1. Essayer depuis l'URL
    const shop = searchParams.get("shop");

    if (shop) {
      setCurrentUser({
        id: "current-user-id",
        email: `admin@${shop}`,
        name: `Admin de ${shop}`,
        shopDomain: shop,
      });
    } else {
      // 2. Essayer depuis localStorage
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
          console.log("✅ User loaded from localStorage:", user);
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch("/api/posts");
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  
  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !currentUser) return;

    setLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newPost,
          authorId: currentUser.id,
        }),
      });

      if (response.ok) {
        setNewPost({ title: "", content: "" });
        setShowCreateForm(false);
        fetchPosts();
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const createComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment || !selectedPost || !currentUser) return;

    try {
      const response = await fetch(`/api/posts/${selectedPost}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          authorId: currentUser.id,
        }),
      });

      if (response.ok) {
        setNewComment("");
        fetchComments(selectedPost);
        fetchPosts(); // Refresh pour mettre à jour le count
      }
    } catch (error) {
      console.error("Error creating comment:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
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
    <ThemeWrapper applyBackgroundColor={true} className="min-h-screen">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Mobile Navigation */}
        <div className="md:hidden mb-4">
          <MobileNavigation />
        </div>

        {/* Header */}
        <AnimatedContainer animation="fadeIn" className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <Link href="/" className="md:hidden">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/" className="hidden md:inline-flex">
                  <Button variant="outline" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                </Link>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold">
                  Forum Communautaire
                </h1>
                <p className="text-muted-foreground text-sm md:text-base">
                  Partagez vos idées et discutez • {posts.length} posts
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gap-2 w-full sm:w-auto"
              disabled={!currentUser}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nouveau post</span>
              <span className="sm:hidden">Créer</span>
            </Button>
          </div>
        </AnimatedContainer>

        {/* User Info */}
        {currentUser && (
          <AnimatedContainer animation="slideUp" delay={100}>
            <Card className="mb-6 bg-green-50 border-green-200">
              <CardContent className="pt-4 md:pt-6">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10">
                    <AvatarFallback className="bg-green-500 text-white text-xs md:text-sm">
                      {getInitials(currentUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-green-800 text-sm md:text-base">
                      Connecté en tant que {currentUser.name}
                    </p>
                    <p className="text-xs md:text-sm text-green-600">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedContainer>
        )}

        {/* Create Post Form */}
        {showCreateForm && (
          <AnimatedContainer animation="scaleIn" delay={50}>
            <Card className="mb-8">
              <CardHeader className="pb-3 md:pb-6">
                <CardTitle className="text-lg md:text-xl">
                  Créer un nouveau post
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={createPost} className="space-y-4">
                  <Input
                    placeholder="Titre de votre post..."
                    value={newPost.title}
                    onChange={(e) =>
                      setNewPost({ ...newPost, title: e.target.value })
                    }
                    className="text-sm md:text-base"
                  />
                  <Textarea
                    placeholder="Contenu de votre post..."
                    rows={3}
                    className="md:rows-4 text-sm md:text-base resize-none"
                    value={newPost.content}
                    onChange={(e) =>
                      setNewPost({ ...newPost, content: e.target.value })
                    }
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      type="submit"
                      disabled={loading}
                      className="flex-1 sm:flex-none"
                    >
                      {loading ? "Publication..." : "Publier"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                      className="flex-1 sm:flex-none"
                    >
                      Annuler
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </AnimatedContainer>
        )}

        {/* Search Bar */}
        <AnimatedContainer animation="slideUp" delay={150}>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Rechercher des posts..."
              className="pl-10 text-sm md:text-base"
            />
          </div>
        </AnimatedContainer>

        {/* Posts List */}
        <LoadingState
          isLoading={loading && posts.length === 0}
          isEmpty={posts.length === 0 && !loading}
          loadingComponent={
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingCard key={i} />
              ))}
            </div>
          }
          emptyComponent={
            <AnimatedContainer animation="fadeIn">
              <Card>
                <CardContent className="text-center py-8 md:py-12">
                  <MessageSquare className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base md:text-lg font-semibold mb-2">
                    Aucun post pour l&apos;instant
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm md:text-base">
                    Soyez le premier à partager quelque chose !
                  </p>
                  
                  {currentUser && (
                    <Button
                      onClick={() => setShowCreateForm(true)}
                      className="w-full sm:w-auto"
                    >
                      Créer le premier post
                    </Button>
                  )}
                </CardContent>
              </Card>
            </AnimatedContainer>
          }
        >
          <StaggeredList staggerDelay={100}>
            {posts.map((post) => (
              <Card
                key={post.id}
                className="hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <CardHeader className="pb-3 md:pb-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex items-start gap-2 md:gap-3 flex-1">
                      <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                        <AvatarFallback className="text-xs md:text-sm">
                          {getInitials(post.author.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base md:text-xl mb-1 md:mb-2 line-clamp-2">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-xs md:text-sm">
                          Par {post.author.name} • {formatDate(post.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-xs self-start flex-shrink-0"
                    >
                      Nouveau
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 text-sm md:text-base line-clamp-3">
                    {post.content}
                  </p>

                  {post.poll && (
                    <div className="mb-4">
                      <PollDisplay
                        poll={post.poll}
                        currentUser={currentUser ?? undefined}
                        onVote={() => fetchPosts()}
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 p-0 h-auto text-xs md:text-sm"
                      onClick={() => {
                        setSelectedPost(
                          selectedPost === post.id ? null : post.id
                        );
                        if (selectedPost !== post.id) {
                          fetchComments(post.id);
                        }
                      }}
                    >
                      <MessageSquare className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="hidden sm:inline">
                        {post._count.comments} commentaires
                      </span>
                      <span className="sm:hidden">{post._count.comments}</span>
                    </Button>
                    <ReactionPicker
                      postId={post.id}
                      currentUserId={currentUser?.id || ""}
                      onReactionUpdate={fetchPosts}
                    />
                  </div>

                  {/* Comments Section */}
                  {selectedPost === post.id && (
                    <AnimatedContainer
                      animation="slideUp"
                      className="mt-4 md:mt-6 pt-4 md:pt-6 border-t"
                    >
                      <h4 className="font-semibold mb-3 md:mb-4 text-sm md:text-base">
                        Commentaires
                      </h4>

                      {/* Comment Form */}
                      {currentUser && (
                        <form onSubmit={createComment} className="mb-4">
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Input
                              placeholder="Écrivez un commentaire..."
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              className="flex-1 text-sm md:text-base"
                            />
                            <Button
                              type="submit"
                              size="sm"
                              className="sm:w-auto w-full"
                            >
                              <Send className="h-3 w-3 md:h-4 md:w-4 mr-1 sm:mr-0" />
                              <span className="sm:hidden">Envoyer</span>
                            </Button>
                          </div>
                        </form>
                      )}

                      {/* Comments List */}
                      <div className="space-y-2 md:space-y-3">
                        {comments.map((comment, index) => (
                          <AnimatedContainer
                            key={comment.id}
                            animation="slideUp"
                            delay={index * 50}
                            className="bg-muted/50 rounded-lg p-2 md:p-3"
                          >
                            <div className="flex items-start gap-2">
                              <Avatar className="h-6 w-6 md:h-8 md:w-8 flex-shrink-0">
                                <AvatarFallback className="text-xs">
                                  {getInitials(comment.author.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                                  <span className="font-medium text-xs md:text-sm truncate">
                                    {comment.author.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground flex-shrink-0">
                                    {formatDate(comment.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs md:text-sm break-words">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </AnimatedContainer>
                        ))}
                        {comments.length === 0 && (
                          <AnimatedContainer animation="fadeIn">
                            <p className="text-muted-foreground text-xs md:text-sm text-center py-4">
                              Aucun commentaire pour l&apos;instant.
                            </p>
                          </AnimatedContainer>
                        )}
                      </div>
                    </AnimatedContainer>
                  )}
                </CardContent>
              </Card>
            ))}
          </StaggeredList>
        </LoadingState>
      </div>
    </ThemeWrapper>
  );
}
