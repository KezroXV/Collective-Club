"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Menu, X, Home, Users, MessageSquare, Settings, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { FadeTransition, SlideTransition } from "./animated-container";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

function DrawerBackdrop({ isOpen, onClose, className }: {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) {
  return (
    <FadeTransition show={isOpen} duration={200}>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 backdrop-blur-sm z-40",
          className
        )}
        onClick={onClose}
      />
    </FadeTransition>
  );
}

function DrawerContent({ isOpen, children, className }: {
  isOpen: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <SlideTransition show={isOpen} direction="right" duration={300}>
      <div
        className={cn(
          "fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl z-50",
          "flex flex-col",
          className
        )}
      >
        {children}
      </div>
    </SlideTransition>
  );
}

export function Drawer({ isOpen, onClose, children, className }: DrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      <DrawerBackdrop isOpen={isOpen} onClose={onClose} />
      <DrawerContent isOpen={isOpen} className={className}>
        {children}
      </DrawerContent>
    </>,
    document.body
  );
}

interface MobileNavigationProps {
  className?: string;
}

export function MobileNavigation({ className }: MobileNavigationProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigationItems = [
    { label: "Accueil", icon: Home, href: "/" },
    { label: "Communauté", icon: Users, href: "/community" },
    { label: "Messages", icon: MessageSquare, href: "/messages" },
    { label: "Paramètres", icon: Settings, href: "/dashboard" },
    { label: "Profil", icon: User, href: "/profile" }
  ];

  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <div className={cn("md:hidden", className)}>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="p-2 rounded-lg bg-white shadow-sm border hover:bg-gray-50 transition-colors"
          aria-label="Ouvrir le menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Menu
          </h2>
          <button
            onClick={closeDrawer}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={closeDrawer}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                >
                  <item.icon className="w-5 h-5 text-gray-500 group-hover:text-blue-500 transition-colors" />
                  <span className="font-medium text-gray-700 group-hover:text-gray-900">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Utilisateur</p>
              <p className="text-xs text-gray-500">En ligne</p>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  className
}: BottomSheetProps) {
  const [mounted, setMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <>
      <FadeTransition show={isOpen}>
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      </FadeTransition>

      <SlideTransition show={isOpen} direction="up" duration={300}>
        <div
          ref={contentRef}
          className={cn(
            "fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-xl z-50",
            "max-h-[90vh] overflow-hidden",
            className
          )}
        >
          <div className="flex items-center justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>

          {title && (
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {children}
          </div>
        </div>
      </SlideTransition>
    </>,
    document.body
  );
}

interface MobileMenuTriggerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MobileMenuTrigger({ className, size = "md" }: MobileMenuTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6"
  };

  const paddingClasses = {
    sm: "p-1.5",
    md: "p-2",
    lg: "p-2.5"
  };

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "rounded-lg bg-white shadow-sm border hover:bg-gray-50 transition-colors",
        "md:hidden flex items-center justify-center",
        paddingClasses[size],
        className
      )}
      aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
    >
      <div className="relative">
        <Menu
          className={cn(
            "transition-opacity duration-200",
            sizeClasses[size],
            isOpen ? "opacity-0" : "opacity-100"
          )}
        />
        <X
          className={cn(
            "absolute inset-0 transition-opacity duration-200",
            sizeClasses[size],
            isOpen ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
    </button>
  );
}

interface SwipeableDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  swipeThreshold?: number;
}

export function SwipeableDrawer({
  isOpen,
  onClose,
  children,
  className,
  swipeThreshold = 100
}: SwipeableDrawerProps) {
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    currentX.current = e.touches[0].clientX;
    const deltaX = currentX.current - startX.current;
    
    if (deltaX < 0) {
      setDragX(deltaX);
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    if (Math.abs(dragX) > swipeThreshold) {
      onClose();
    }
    
    setDragX(0);
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} className={className}>
      <div
        className="h-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {children}
      </div>
    </Drawer>
  );
}