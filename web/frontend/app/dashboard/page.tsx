/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RolesSection from "@/components/RolesSection";
import CategoriesSection from "@/components/CategoriesSection";
import Link from "next/link";
import { FileText, TrendingUp, Users, Home, HelpCircle } from "lucide-react";
import CustomizationModal from "./components/CustomizationModal";
import { useTheme } from "@/contexts/ThemeContext";
import ThemeWrapper from "@/components/ThemeWrapper";
import { MobileNavigation } from "@/components/ui/mobile-drawer";
import { LoadingState, LoadingSkeleton } from "@/components/ui/loading";
import { AnimatedContainer, StaggeredList } from "@/components/ui/animated-container";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const [showCustomization, setShowCustomization] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { loadUserTheme } = useTheme();

  const [stats, setStats] = useState({
    posts: 37,
    postsChange: -28,
    engagement: 130,
    engagementChange: 8,
    subscribers: 130,
    subscribersChange: 12,
  });

  // Charger l'utilisateur depuis localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        // Charger le thème de l'utilisateur
        if (user.id) {
          loadUserTheme(user.id);
        }
      } catch (error) {
        console.error("Error parsing stored user:", error);
      }
    }
    
    // Simuler le chargement des stats
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [loadUserTheme]);

  return (
    <ThemeWrapper applyBackgroundColor={true} className="min-h-screen p-4 md:p-8">
      {/* Mobile Navigation */}
      <div className="md:hidden mb-4">
        <MobileNavigation />
      </div>

      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header avec métriques */}
        <AnimatedContainer animation="fadeIn">
          <LoadingState
            isLoading={loading}
            loadingComponent={
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="shadow-sm border-gray-200">
                    <CardContent className="p-4 md:p-6">
                      <LoadingSkeleton lines={3} />
                    </CardContent>
                  </Card>
                ))}
              </div>
            }
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <StaggeredList staggerDelay={100}>
                {/* Posts */}
                <Card className={cn(
                  "shadow-sm border-gray-200 transition-all duration-200",
                  "hover-lift hover:shadow-md"
                )}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs md:text-sm text-gray-500">Posts</p>
                      <HelpCircle className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-1">
                      <span className="text-2xl md:text-3xl font-bold text-blue-600">
                        {stats.posts}
                      </span>
                      <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded w-fit">
                        ↓ {Math.abs(stats.postsChange)}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Engagement */}
                <Card className={cn(
                  "shadow-sm border-gray-200 transition-all duration-200",
                  "hover-lift hover:shadow-md"
                )}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs md:text-sm text-gray-500">Engagement</p>
                      <HelpCircle className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">
                        {stats.engagement}
                      </span>
                      <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
                        ↑ {stats.engagementChange}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Abonnés */}
                <Card className={cn(
                  "shadow-sm border-gray-200 transition-all duration-200",
                  "hover-lift hover:shadow-md"
                )}>
                  <CardContent className="p-4 md:p-6">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs md:text-sm text-gray-500">Abonnés</p>
                      <HelpCircle className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                    </div>
                    <div className="flex items-center gap-1 md:gap-2">
                      <Users className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                      <span className="text-2xl md:text-3xl font-bold text-gray-900">
                        {stats.subscribers}
                      </span>
                      <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
                        ↑ {stats.subscribersChange}%
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Espace vide pour mobile, statistique supplémentaire pour desktop */}
                <div className="hidden md:block"></div>
              </StaggeredList>
            </div>
          </LoadingState>
        </AnimatedContainer>

        {/* Contenu principal - Responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne gauche - Gestion */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatedContainer animation="slideLeft" delay={100}>
              {/* Section Gérer */}
              <Card className={cn(
                "shadow-sm border-gray-200 transition-all duration-200",
                "hover:shadow-md"
              )}>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                    Gérer
                  </h3>
                  <nav className="space-y-1">
                    <Link
                      href="/dashboard/clients"
                      className={cn(
                        "flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg",
                        "hover:bg-gray-50 transition-all duration-200 hover-lift button-press"
                      )}
                    >
                      <Users className="h-4 w-4 mr-3" />
                      Clients
                    </Link>
                    <Link
                      href="/dashboard/posts"
                      className={cn(
                        "flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg",
                        "hover:bg-gray-50 transition-all duration-200 hover-lift button-press"
                      )}
                    >
                      <FileText className="h-4 w-4 mr-3" />
                      Posts
                    </Link>
                    <Link
                      href="/dashboard/customization"
                      className={cn(
                        "flex items-center px-3 py-2 text-sm text-gray-600 rounded-lg",
                        "hover:bg-gray-50 transition-all duration-200 hover-lift button-press"
                      )}
                    >
                      🎨 Thème
                    </Link>
                  </nav>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer animation="slideLeft" delay={150}>
              {/* Communautés phares */}
              <Card className={cn(
                "shadow-sm border-gray-200 transition-all duration-200",
                "hover:shadow-md"
              )}>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                    Communautés phares
                  </h3>
                  <div className="space-y-4 text-sm text-gray-600">
                    <p>Un espace pour les ecommerçants dans la cosmétique</p>
                    <p>
                      Débutants : Envoyez tous vos conseils ici sur comment gérer
                      sa boutique
                    </p>
                    <p>Quels sont vos objectifs ?</p>
                  </div>
                </CardContent>
              </Card>
            </AnimatedContainer>

            <AnimatedContainer animation="slideLeft" delay={200}>
              {/* Retour au forum */}
              <Link
                href="/community"
                className={cn(
                  "flex items-center px-4 py-3 text-sm text-blue-600 bg-blue-50 rounded-lg",
                  "hover:bg-blue-100 transition-all duration-200 hover-lift button-press"
                )}
              >
                <Home className="h-4 w-4 mr-3" />
                Retour au forum
              </Link>
            </AnimatedContainer>
          </div>

          {/* Colonne centrale - Vue d'ensemble */}
          <div className="lg:col-span-6 order-first lg:order-none">
            <AnimatedContainer animation="scaleIn" delay={150}>
              <Card className={cn(
                "shadow-sm border-gray-200 transition-all duration-200",
                "hover:shadow-md"
              )}>
                <CardContent className="p-6 md:p-8">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
                    Vue d&apos;ensemble
                  </h2>
                  <p className="text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                    Tableau de bord principal pour gérer votre communauté.
                  </p>

                  <LoadingState
                    isLoading={loading}
                    loadingComponent={
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                        <LoadingSkeleton lines={2} />
                        <LoadingSkeleton lines={2} />
                      </div>
                    }
                  >
                    {/* Statistiques détaillées */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                      <StaggeredList staggerDelay={100}>
                        <div className="hover-lift transition-transform duration-200">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Posts cette semaine
                          </h4>
                          <p className="text-3xl md:text-4xl font-bold text-blue-600">12</p>
                        </div>
                        <div className="hover-lift transition-transform duration-200">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">
                            Commentaires
                          </h4>
                          <p className="text-3xl md:text-4xl font-bold text-green-600">245</p>
                        </div>
                      </StaggeredList>
                    </div>
                  </LoadingState>
                </CardContent>
              </Card>
            </AnimatedContainer>
          </div>

          {/* Colonne droite - Rôles et Catégories */}
          <div className="lg:col-span-3 space-y-6">
            <AnimatedContainer animation="slideRight" delay={100}>
              {/* Section Rôles */}
              <RolesSection />
            </AnimatedContainer>

            <AnimatedContainer animation="slideRight" delay={150}>
              {/* Section Catégories */}
              <CategoriesSection />
            </AnimatedContainer>

            <AnimatedContainer animation="slideRight" delay={200}>
              {/* Section Personnalisation */}
              <Card className={cn(
                "shadow-sm border-gray-200 transition-all duration-200",
                "hover:shadow-md"
              )}>
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                    Personnalisation du forum
                  </h3>
                  <Button
                    className={cn(
                      "w-full bg-blue-600 hover:bg-blue-700 text-white",
                      "transition-all duration-200 hover-lift button-press"
                    )}
                    onClick={() => setShowCustomization(true)}
                  >
                    ✏️ Personnaliser
                  </Button>
                </CardContent>
              </Card>
              
              <CustomizationModal
                isOpen={showCustomization}
                onClose={() => setShowCustomization(false)}
                userId={currentUser?.id}
              />
            </AnimatedContainer>
          </div>
        </div>
      </div>
    </ThemeWrapper>
  );
}
