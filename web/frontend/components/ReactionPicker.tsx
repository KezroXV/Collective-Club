/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart } from "lucide-react";
import { AnimatedContainer } from "@/components/ui/animated-container";
import { cn } from "@/lib/utils";

interface ReactionPickerProps {
  postId: string;
  currentUserId: string;
  initialReactions?: any;
  onReactionUpdate?: () => void;
}

const REACTIONS = [
  { type: "LIKE", emoji: "👍", label: "J'aime" },
  { type: "LOVE", emoji: "❤️", label: "Adore" },
  { type: "LAUGH", emoji: "😂", label: "Drôle" },
  { type: "WOW", emoji: "😮", label: "Impressionnant" },
  { type: "APPLAUSE", emoji: "👏", label: "Bravo" },
];

export default function ReactionPicker({
  postId,
  currentUserId,
  initialReactions = {},
  onReactionUpdate,
}: ReactionPickerProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [loading, setLoading] = useState<string | null>(null);
  const userIsAuthenticated = Boolean(currentUserId);

  const handleReaction = async (reactionType: string) => {
    if (!currentUserId) return;

    setLoading(reactionType);
    
    // Animation immédiate pour une meilleure UX
    const hasReacted = hasUserReacted(reactionType);
    
    try {
      const response = await fetch(`/api/posts/${postId}/reactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: reactionType,
          userId: currentUserId,
        }),
      });

      if (response.ok) {
        // Refresh reactions
        fetchReactions();
        onReactionUpdate?.();
        
        // Trigger heart pop animation si c'est une nouvelle réaction
        if (!hasReacted) {
          const heartButton = document.querySelector(`[data-reaction="${reactionType}"]`);
          heartButton?.classList.add('animate-heart-pop');
          setTimeout(() => {
            heartButton?.classList.remove('animate-heart-pop');
          }, 200);
        }
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    } finally {
      setLoading(null);
    }
  };

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/posts/${postId}/reactions`);
      if (response.ok) {
        const data = await response.json();
        setReactions(data);
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  // Charger les réactions au montage et lors des changements de post
  useEffect(() => {
    fetchReactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);

  const totalReactions = useMemo(() => {
    return Object.values(reactions || {}).reduce(
      (total: number, users: any) =>
        total + (Array.isArray(users) ? users.length : 0),
      0
    );
  }, [reactions]);

  const hasUserReacted = (reactionType: string) => {
    return reactions[reactionType]?.some(
      (user: any) => user.id === currentUserId
    );
  };

  const getUserReactionType = (): string | null => {
    for (const reaction of REACTIONS) {
      if (hasUserReacted(reaction.type)) return reaction.type;
    }
    return null;
  };

  const emojiStyle = {
    fontFamily:
      "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji','EmojiOne Color','Twemoji Mozilla',sans-serif",
  } as const;

  return (
    <div className="relative">
      <div className="flex items-center gap-3">
        {/* Chips des réactions uniquement si l'utilisateur a déjà réagi */}
        {getUserReactionType() && (
          <AnimatedContainer animation="slideLeft" className="flex flex-wrap items-center gap-1">
            {REACTIONS.map((reaction, index) => {
              const count = reactions?.[reaction.type]?.length || 0;
              if (count === 0) return null;
              return (
                <AnimatedContainer
                  key={reaction.type}
                  animation="scaleIn"
                  delay={index * 30}
                >
                  <Button
                    variant={
                      hasUserReacted(reaction.type) ? "default" : "secondary"
                    }
                    size="sm"
                    className={cn(
                      "gap-1 h-auto py-1 px-2 text-xs transition-all duration-200 hover:scale-110",
                      "hover-lift button-press",
                      hasUserReacted(reaction.type) && "ring-2 ring-primary/20"
                    )}
                    onClick={() => handleReaction(reaction.type)}
                    disabled={!userIsAuthenticated || loading === reaction.type}
                    title={reaction.label}
                    data-reaction={reaction.type}
                  >
                    <span style={emojiStyle} className="text-[16px] md:text-[18px] leading-none">
                      {reaction.emoji}
                    </span>
                    <span className="min-w-[1ch]">{count}</span>
                  </Button>
                </AnimatedContainer>
              );
            })}
          </AnimatedContainer>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "bg-white px-3 md:px-4 py-2 rounded-full border-gray-200 text-gray-700",
                "hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2",
                "transition-all duration-200 hover-lift button-press",
                "focus-ring disabled:opacity-50 disabled:cursor-not-allowed",
                totalReactions > 0 && "border-primary/20 text-primary hover:text-primary"
              )}
              disabled={!userIsAuthenticated}
              title={
                userIsAuthenticated ? "Réagir" : "Connectez-vous pour réagir"
              }
            >
              <Heart className={cn(
                "h-3 w-3 md:h-4 md:w-4 transition-all duration-200",
                totalReactions > 0 && "text-red-500 fill-current"
              )} />
              <span className="text-xs md:text-sm font-medium min-w-[1ch]">
                {totalReactions || "0"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={8}
            className="p-2 min-w-[200px] md:min-w-[220px] animate-scale-in"
          >
            <div className="grid grid-cols-5 gap-1 md:gap-2">
              {REACTIONS.map((reaction, index) => (
                <DropdownMenuItem
                  key={reaction.type}
                  className={cn(
                    "p-2 justify-center cursor-pointer rounded-lg",
                    "transition-all duration-200 hover:scale-110 hover:bg-gray-100",
                    "button-press focus-ring"
                  )}
                  onClick={() => handleReaction(reaction.type)}
                  disabled={!userIsAuthenticated || loading === reaction.type}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <span
                    title={reaction.label}
                    className={cn(
                      "inline-flex items-center justify-center transition-transform duration-200",
                      loading === reaction.type && "animate-pulse"
                    )}
                    style={emojiStyle}
                    data-reaction={reaction.type}
                  >
                    <span className="text-[20px] md:text-[24px] leading-none">
                      {reaction.emoji}
                    </span>
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {/* Plus de badge total séparé: le compteur est intégré au bouton coeur */}
      </div>
    </div>
  );
}
