"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { timing } from "@/lib/animations";

interface AnimatedContainerProps {
  children: React.ReactNode;
  className?: string;
  animation?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scaleIn";
  delay?: number;
  duration?: number;
  once?: boolean;
  threshold?: number;
}

export function AnimatedContainer({
  children,
  className,
  animation = "fadeIn",
  delay = 0,
  duration = 300,
  once = true,
  threshold = 0.1
}: AnimatedContainerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!once || !hasAnimated)) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, delay);
        } else if (!once && !entry.isIntersecting) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: "50px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay, once, hasAnimated, threshold]);

  const getInitialStyle = () => {
    switch (animation) {
      case "slideUp":
        return { opacity: 0, transform: "translateY(20px)" };
      case "slideDown":
        return { opacity: 0, transform: "translateY(-20px)" };
      case "slideLeft":
        return { opacity: 0, transform: "translateX(-20px)" };
      case "slideRight":
        return { opacity: 0, transform: "translateX(20px)" };
      case "scaleIn":
        return { opacity: 0, transform: "scale(0.9)" };
      default:
        return { opacity: 0 };
    }
  };

  const getVisibleStyle = () => {
    return {
      opacity: 1,
      transform: "translateX(0) translateY(0) scale(1)",
      transition: `all ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`
    };
  };

  return (
    <div
      ref={ref}
      className={cn("transition-all", className)}
      style={isVisible ? getVisibleStyle() : getInitialStyle()}
    >
      {children}
    </div>
  );
}

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
  animation?: "fadeIn" | "slideUp" | "slideLeft";
}

export function StaggeredList({
  children,
  className,
  staggerDelay = 50,
  animation = "slideUp"
}: StaggeredListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {children.map((child, index) => (
        <AnimatedContainer
          key={index}
          animation={animation}
          delay={index * staggerDelay}
          className="w-full"
        >
          {child}
        </AnimatedContainer>
      ))}
    </div>
  );
}

interface FadeTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function FadeTransition({
  show,
  children,
  className,
  duration = 200
}: FadeTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn("transition-opacity", className)}
      style={{
        opacity: show ? 1 : 0,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      {children}
    </div>
  );
}

interface SlideTransitionProps {
  show: boolean;
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
  duration?: number;
}

export function SlideTransition({
  show,
  children,
  direction = "up",
  className,
  duration = 300
}: SlideTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  const getTransform = () => {
    if (!show) {
      switch (direction) {
        case "up":
          return "translateY(20px)";
        case "down":
          return "translateY(-20px)";
        case "left":
          return "translateX(20px)";
        case "right":
          return "translateX(-20px)";
      }
    }
    return "translate(0)";
  };

  return (
    <div
      className={cn("transition-all overflow-hidden", className)}
      style={{
        opacity: show ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {children}
    </div>
  );
}

interface ScaleTransitionProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  duration?: number;
}

export function ScaleTransition({
  show,
  children,
  className,
  duration = 200
}: ScaleTransitionProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  if (!shouldRender) return null;

  return (
    <div
      className={cn("transition-all origin-center", className)}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "scale(1)" : "scale(0.95)",
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }}
    >
      {children}
    </div>
  );
}

interface ParallaxContainerProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function ParallaxContainer({
  children,
  speed = 0.5,
  className
}: ParallaxContainerProps) {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -speed;
        setOffsetY(rate);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div
        style={{
          transform: `translateY(${offsetY}px)`,
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
}

interface PulseProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  intensity?: "light" | "medium" | "strong";
}

export function Pulse({
  children,
  isActive = true,
  className,
  intensity = "medium"
}: PulseProps) {
  const intensityClasses = {
    light: "animate-pulse opacity-70",
    medium: "animate-pulse opacity-50",
    strong: "animate-pulse opacity-30"
  };

  return (
    <div
      className={cn(
        isActive && intensityClasses[intensity],
        className
      )}
      style={{
        animationDuration: "2s"
      }}
    >
      {children}
    </div>
  );
}

interface BouncingIconProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}

export function BouncingIcon({
  children,
  isActive = false,
  className
}: BouncingIconProps) {
  return (
    <div
      className={cn(
        "inline-block transition-transform duration-200",
        isActive && "animate-bounce",
        className
      )}
      style={{
        animationDuration: timing.slow
      }}
    >
      {children}
    </div>
  );
}

interface FloatingActionProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function FloatingAction({
  children,
  className,
  onClick
}: FloatingActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "bg-blue-500 hover:bg-blue-600 text-white",
        "w-14 h-14 rounded-full shadow-lg",
        "flex items-center justify-center",
        "transform transition-all duration-200",
        "hover:scale-110 hover:shadow-xl",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/30",
        className
      )}
    >
      {children}
    </button>
  );
}