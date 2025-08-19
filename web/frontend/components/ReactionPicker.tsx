/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
  const [showPicker, setShowPicker] = useState(false);

  const handleReaction = async (reactionType: string) => {
    if (!currentUserId) return;

    setLoading(reactionType);
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
      }
    } catch (error) {
      console.error("Error handling reaction:", error);
    } finally {
      setLoading(null);
      setShowPicker(false);
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

  const getTotalReactions = () => {
    return Object.values(reactions).reduce(
      (total: number, users: any) => total + users.length,
      0
    );
  };

  const hasUserReacted = (reactionType: string) => {
    return reactions[reactionType]?.some(
      (user: any) => user.id === currentUserId
    );
  };

  return (
    <div className="relative">
      {/* Bouton principal */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1 p-0 h-auto text-muted-foreground hover:text-foreground"
        onClick={() => setShowPicker(!showPicker)}
      >
        <span>❤️</span>
        {getTotalReactions()} réactions
      </Button>

      {/* Picker des réactions */}
      {showPicker && (
        <Card className="absolute bottom-full left-0 mb-2 p-2 flex gap-1 z-10 bg-background border shadow-lg">
          {REACTIONS.map((reaction) => (
            <Button
              key={reaction.type}
              variant={hasUserReacted(reaction.type) ? "default" : "ghost"}
              size="sm"
              className="p-2 h-auto"
              onClick={() => handleReaction(reaction.type)}
              disabled={loading === reaction.type}
              title={reaction.label}
            >
              <span className="text-lg">{reaction.emoji}</span>
            </Button>
          ))}
        </Card>
      )}

      {/* Affichage des réactions actives */}
      {getTotalReactions() > 0 && (
        <div className="flex gap-1 mt-2">
          {REACTIONS.map((reaction) => {
            const count = reactions[reaction.type]?.length || 0;
            if (count === 0) return null;

            return (
              <Button
                key={reaction.type}
                variant={
                  hasUserReacted(reaction.type) ? "default" : "secondary"
                }
                size="sm"
                className="gap-1 h-auto py-1 px-2 text-xs"
                onClick={() => handleReaction(reaction.type)}
              >
                <span>{reaction.emoji}</span>
                {count}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
