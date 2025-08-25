"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { lightTheme, type Theme } from "@/lib/constants/colors";
import { timing } from "@/lib/animations";

interface ThemeColors {
  Posts: string;
  Bordures: string;
  Fond: string;
  Police: string;
}

interface AnimationPreference {
  enabled: boolean;
  reducedMotion: boolean;
}

interface ThemeContextType {
  colors: ThemeColors;
  selectedFont: string;
  coverImageUrl: string | null;
  bannerImageUrl: string;
  systemColors: Theme;
  animations: AnimationPreference;
  updateTheme: (colors: ThemeColors, font: string, coverImage?: string | null, bannerImage?: string) => void;
  loadUserTheme: (userId: string) => Promise<void>;
  toggleAnimations: (enabled?: boolean) => void;
  applyThemeToDocument: () => void;
}

const defaultTheme: ThemeColors = {
  Posts: "#3B82F6",
  Bordures: "#E5E7EB",
  Fond: "#F9FAFB",
  Police: "#111827",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultTheme);
  const [selectedFont, setSelectedFont] = useState("Helvetica");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [bannerImageUrl, setBannerImageUrl] = useState<string>("/Bannière.svg");
  const [animations, setAnimations] = useState<AnimationPreference>({
    enabled: true,
    reducedMotion: false,
  });

  // Détecter les préférences de mouvement réduit
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setAnimations(prev => ({ ...prev, reducedMotion: mediaQuery.matches }));

    const handleChange = (e: MediaQueryListEvent) => {
      setAnimations(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const updateTheme = (newColors: ThemeColors, font: string, coverImage?: string | null, bannerImage?: string) => {
    setColors(newColors);
    setSelectedFont(font);
    if (coverImage !== undefined) {
      setCoverImageUrl(coverImage);
    }
    if (bannerImage !== undefined) {
      setBannerImageUrl(bannerImage);
    }
    applyThemeToDocument();
  };

  const toggleAnimations = (enabled?: boolean) => {
    setAnimations(prev => ({
      ...prev,
      enabled: enabled !== undefined ? enabled : !prev.enabled
    }));
  };

  const applyThemeToDocument = useCallback(() => {
    const root = document.documentElement;
    
    // Appliquer les couleurs personnalisées
    root.style.setProperty('--color-posts', colors.Posts);
    root.style.setProperty('--color-borders', colors.Bordures);
    root.style.setProperty('--color-bg', colors.Fond);
    root.style.setProperty('--color-text', colors.Police);
    root.style.setProperty('--font-family', selectedFont);

    // Appliquer les couleurs du système de design
    root.style.setProperty('--color-primary', lightTheme.primary.default);
    root.style.setProperty('--color-primary-hover', lightTheme.primary.hover);
    root.style.setProperty('--color-bg-primary', lightTheme.background.primary);
    root.style.setProperty('--color-bg-secondary', lightTheme.background.secondary);
    root.style.setProperty('--color-text-primary', lightTheme.text.primary);
    root.style.setProperty('--color-text-secondary', lightTheme.text.secondary);
    root.style.setProperty('--color-border-default', lightTheme.border.default);
    
    // Appliquer les variables d'animation
    root.style.setProperty('--animation-duration-fast', animations.reducedMotion ? '0ms' : timing.fast);
    root.style.setProperty('--animation-duration-normal', animations.reducedMotion ? '0ms' : timing.normal);
    root.style.setProperty('--animation-duration-slow', animations.reducedMotion ? '0ms' : timing.slow);
    root.style.setProperty('--animation-enabled', animations.enabled ? '1' : '0');
  }, [colors, selectedFont, animations]);

  // Appliquer le thème au montage
  useEffect(() => {
    applyThemeToDocument();
  }, [applyThemeToDocument]);

  const loadUserTheme = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/customization?userId=${userId}`);
      if (response.ok) {
        const settings = await response.json();
        setColors({
          Posts: settings.colorPosts,
          Bordures: settings.colorBorders,
          Fond: settings.colorBg,
          Police: settings.colorText,
        });
        setSelectedFont(settings.selectedFont);
        setCoverImageUrl(settings.coverImageUrl);
        setBannerImageUrl(settings.bannerImageUrl || "/Bannière.svg");
      }
    } catch (error) {
      console.error("Erreur lors du chargement du thème:", error);
    }
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        colors,
        selectedFont,
        coverImageUrl,
        bannerImageUrl,
        updateTheme,
        loadUserTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}