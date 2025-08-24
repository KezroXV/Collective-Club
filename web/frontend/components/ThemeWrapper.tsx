"use client";

import { useTheme } from "@/contexts/ThemeContext";
import { ReactNode, useEffect } from "react";

interface ThemeWrapperProps {
  children: ReactNode;
  applyBackgroundColor?: boolean;
  className?: string;
}

export default function ThemeWrapper({ 
  children, 
  applyBackgroundColor = false,
  className = ""
}: ThemeWrapperProps) {
  const { colors, selectedFont } = useTheme();

  useEffect(() => {
    // Appliquer la police globalement
    document.body.style.fontFamily = selectedFont;
  }, [selectedFont]);

  const dynamicStyle: React.CSSProperties = {
    ...(applyBackgroundColor && { backgroundColor: colors.Fond }),
    color: colors.Police,
    fontFamily: selectedFont,
  };

  return (
    <div 
      className={className} 
      style={dynamicStyle}
      // Variables CSS pour les enfants
      data-theme-posts={colors.Posts}
      data-theme-borders={colors.Bordures}
      data-theme-bg={colors.Fond}
      data-theme-text={colors.Police}
    >
      {children}
    </div>
  );
}