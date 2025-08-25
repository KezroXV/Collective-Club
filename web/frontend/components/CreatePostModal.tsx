/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  X,
  Plus,
  Loader2,
  Upload,
  Image as ImageIcon,
  BarChart3,
} from "lucide-react";
import { AnimatedContainer, ScaleTransition } from "@/components/ui/animated-container";
import { LoadingButton } from "@/components/ui/loading";
import { cn } from "@/lib/utils";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onPostCreated: () => void;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  currentUser,
  onPostCreated,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", "", "", ""]);
  const [showPoll, setShowPoll] = useState(false);
  const [categories, setCategories] = useState<
    Array<{ id: string; name: string; color: string }>
  >([]);
  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedCategory("");
    setImageUrl("");
    setShowPoll(false); // ✅ AJOUTER
    setPollQuestion(""); // ✅ AJOUTER
    setPollOptions(["", "", "", ""]); // ✅ AJOUTER
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !currentUser) return;

    // ✅ VALIDATION SONDAGE
    if (
      showPoll &&
      (!pollQuestion.trim() ||
        pollOptions.filter((opt) => opt.trim()).length < 2)
    ) {
      alert("Un sondage doit avoir une question et au moins 2 options");
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ PRÉPARER LES DONNÉES DU SONDAGE
      let pollData = null;
      if (showPoll && pollQuestion.trim()) {
        const validOptions = pollOptions
          .filter((opt) => opt.trim())
          .map((text, index) => ({
            text: text.trim(),
            order: index,
          }));

        if (validOptions.length >= 2) {
          pollData = {
            question: pollQuestion.trim(),
            options: validOptions,
          };
        }
      }

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: selectedCategory || undefined,
          imageUrl: imageUrl || undefined,
          authorId: currentUser.id,
          poll: pollData, // ✅ ENVOYER LES DONNÉES DU SONDAGE
        }),
      });

      if (response.ok) {
        handleClose();
        onPostCreated();
      } else {
        console.error("Error creating post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = useCallback((file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        handleImageUpload(file);
      }
    },
    [handleImageUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <AnimatedContainer animation="scaleIn">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-xl font-semibold">
              Créer un post
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 md:space-y-6 py-4">
            {/* Titre */}
            <AnimatedContainer animation="slideUp" delay={50}>
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Titre
                </Label>
                <Input
                  id="title"
                  placeholder="J'ai une idée de boutique mais je ne sais pas comment choisir..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={cn(
                    "h-10 md:h-12 text-sm md:text-base transition-all duration-200",
                    "focus-ring hover:border-primary/50"
                  )}
                />
              </div>
            </AnimatedContainer>

            {/* Description */}
            <AnimatedContainer animation="slideUp" delay={100}>
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Description
                </Label>
                <Textarea
                  id="content"
                  placeholder="Salut, je ne sais pas comment choisir entre quelques idées de..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={cn(
                    "min-h-[100px] md:min-h-[120px] text-sm md:text-base resize-none transition-all duration-200",
                    "focus-ring hover:border-primary/50"
                  )}
                />
              </div>
            </AnimatedContainer>

            {/* Upload d'image */}
            <AnimatedContainer animation="slideUp" delay={150}>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Ajouter une image</Label>

                <ScaleTransition show={!!imageUrl}>
                  {imageUrl && (
                    <Card className="relative overflow-hidden group hover-lift">
                      <CardContent className="p-0">
                        <img
                          src={imageUrl}
                          alt="Uploaded"
                          className="w-full h-40 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            className={cn(
                              "bg-red-500 hover:bg-red-600 transition-all duration-200",
                              "button-press hover-lift"
                            )}
                            onClick={() => setImageUrl("")}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Supprimer
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </ScaleTransition>

                {!imageUrl && (
                  <Card
                    className={cn(
                      "border-2 border-dashed cursor-pointer transition-all duration-200",
                      isDragOver
                        ? "border-primary bg-primary/10 scale-102"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50",
                      "hover-lift"
                    )}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <CardContent className="flex flex-col items-center justify-center py-12 md:py-16">
                      <div
                        className={cn(
                          "w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-4 transition-all duration-200",
                          isDragOver ? "bg-primary/20 scale-110" : "bg-gray-100"
                        )}
                      >
                        <ImageIcon
                          className={cn(
                            "h-6 w-6 md:h-8 md:w-8 transition-colors duration-200",
                            isDragOver ? "text-primary" : "text-gray-400"
                          )}
                        />
                      </div>

                      <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2">
                        {isDragOver
                          ? "Déposez votre image ici"
                          : "Ajouter une image"}
                      </h3>

                      <p className="text-xs md:text-sm text-gray-600 text-center mb-4 px-4">
                        Glissez-déposez une image ou cliquez pour parcourir
                      </p>

                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "gap-2 transition-all duration-200",
                          "hover-lift button-press"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                        Parcourir
                      </Button>

                      <p className="text-xs text-gray-400 mt-3">
                        PNG, JPG, GIF jusqu&apos;à 10MB
                      </p>
                    </CardContent>
                  </Card>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
            </AnimatedContainer>

            {/* Catégories */}
            <AnimatedContainer animation="slideUp" delay={200}>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Ajouter une catégorie</Label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category, index) => (
                    <AnimatedContainer key={category.id} animation="scaleIn" delay={index * 30}>
                      <Button
                        variant={
                          selectedCategory === category.name ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() =>
                          setSelectedCategory(
                            selectedCategory === category.name ? "" : category.name
                          )
                        }
                        className={cn(
                          "gap-2 rounded-full transition-all duration-200",
                          "hover-lift button-press hover:scale-105"
                        )}
                      >
                        <div
                          className={`w-3 h-3 rounded-full ${category.color}`}
                        ></div>
                        {category.name}
                      </Button>
                    </AnimatedContainer>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 rounded-full border-dashed opacity-50 cursor-not-allowed"
                    disabled
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </AnimatedContainer>

            {/* Sondage */}
            <AnimatedContainer animation="slideUp" delay={250}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Ajouter un sondage</Label>
                  <Button
                    type="button"
                    variant={showPoll ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowPoll(!showPoll)}
                    className={cn(
                      "gap-2 transition-all duration-200",
                      "hover-lift button-press"
                    )}
                  >
                    <BarChart3 className="h-4 w-4" />
                    {showPoll ? "Retirer" : "Sondage"}
                  </Button>
                </div>

                <ScaleTransition show={showPoll}>
                  {showPoll && (
                    <Card className="p-4 space-y-4 border border-primary/20">
                      {/* Question du sondage */}
                      <div className="space-y-2">
                        <Label htmlFor="poll-question" className="text-sm font-medium">
                          Question du sondage
                        </Label>
                        <Input
                          id="poll-question"
                          placeholder="Quelle est votre couleur préférée ?"
                          value={pollQuestion}
                          onChange={(e) => setPollQuestion(e.target.value)}
                          className={cn(
                            "h-10 transition-all duration-200",
                            "focus-ring hover:border-primary/50"
                          )}
                        />
                      </div>

                      {/* Options du sondage */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          Options (4 maximum)
                        </Label>
                        {pollOptions.map((option, index) => (
                          <AnimatedContainer key={index} animation="slideLeft" delay={index * 50}>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-500 w-6 flex-shrink-0">
                                {index + 1}.
                              </span>
                              <Input
                                placeholder={`Option ${index + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...pollOptions];
                                  newOptions[index] = e.target.value;
                                  setPollOptions(newOptions);
                                }}
                                className={cn(
                                  "h-9 transition-all duration-200",
                                  "focus-ring hover:border-primary/50"
                                )}
                              />
                            </div>
                          </AnimatedContainer>
                        ))}
                      </div>
                    </Card>
                  )}
                </ScaleTransition>
              </div>
            </AnimatedContainer>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className={cn(
                "transition-all duration-200",
                "hover-lift button-press"
              )}
            >
              Annuler
            </Button>
            <LoadingButton
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              isLoading={isSubmitting}
              loadingText="Publication..."
              className={cn(
                "bg-primary hover:bg-primary/90 text-primary-foreground",
                "transition-all duration-200 hover-lift"
              )}
            >
              Publier
            </LoadingButton>
          </div>
        </AnimatedContainer>
      </DialogContent>
    </Dialog>
  );
}
