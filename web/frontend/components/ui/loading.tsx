"use client";

import { cn } from "@/lib/utils";
import { timing } from "@/lib/animations";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <div 
      className={cn(
        "animate-spin rounded-full border-2 border-gray-200 border-t-blue-500",
        sizeClasses[size],
        className
      )}
      style={{
        animationDuration: timing.slow
      }}
    />
  );
}

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingDots({ size = "md", className }: LoadingDotsProps) {
  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2"
  };

  const dotSize = dotSizes[size];

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "bg-gray-400 rounded-full animate-pulse",
            dotSize
          )}
          style={{
            animationDelay: `${i * 150}ms`,
            animationDuration: timing.slow
          }}
        />
      ))}
    </div>
  );
}

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
}

export function LoadingSkeleton({ className, lines = 3, avatar = false }: LoadingSkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      {avatar && (
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      )}
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-4 bg-gray-200 rounded",
              i === lines - 1 ? "w-3/4" : "w-full"
            )}
          />
        ))}
      </div>
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
  showImage?: boolean;
}

export function LoadingCard({ className, showImage = true }: LoadingCardProps) {
  return (
    <div className={cn("bg-white rounded-lg border p-6 animate-pulse", className)}>
      {showImage && (
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4" />
      )}
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gray-200 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-24" />
          <div className="h-3 bg-gray-200 rounded w-16" />
        </div>
      </div>
      <div className="space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t">
        <div className="flex space-x-4">
          <div className="h-8 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-16 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

interface LoadingOverlayProps {
  show: boolean;
  message?: string;
  className?: string;
}

export function LoadingOverlay({ show, message = "Chargement...", className }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className={cn(
      "fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center",
      className
    )}>
      <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full mx-4">
        <div className="flex items-center space-x-4">
          <LoadingSpinner size="lg" />
          <div>
            <h3 className="font-medium text-gray-900">{message}</h3>
            <p className="text-sm text-gray-500 mt-1">Veuillez patienter...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface LoadingStateProps {
  isLoading: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  children: React.ReactNode;
}

export function LoadingState({
  isLoading,
  error,
  isEmpty = false,
  loadingComponent,
  emptyComponent,
  errorComponent,
  children
}: LoadingStateProps) {
  if (error) {
    return (
      errorComponent || (
        <div className="text-center py-8">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Une erreur s&apos;est produite
          </h3>
          <p className="text-gray-600">
            {error.message || "Impossible de charger les données"}
          </p>
        </div>
      )
    );
  }

  if (isLoading) {
    return loadingComponent || <LoadingSkeleton lines={4} avatar />;
  }

  if (isEmpty) {
    return (
      emptyComponent || (
        <div className="text-center py-8">
          <div className="text-gray-400 text-lg mb-2">📭</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun contenu
          </h3>
          <p className="text-gray-600">
            Il n&apos;y a rien à afficher pour le moment.
          </p>
        </div>
      )
    );
  }

  return <>{children}</>;
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showLabel?: boolean;
}

export function ProgressBar({ progress, className, showLabel = false }: ProgressBarProps) {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progression</span>
          <span>{clampedProgress}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
}

interface PulsingButtonProps {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
  onClick?: () => void;
}

export function PulsingButton({ 
  children, 
  isActive = false, 
  className,
  onClick 
}: PulsingButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-lg transition-all duration-200",
        isActive && "animate-pulse bg-blue-500 text-white",
        !isActive && "bg-gray-100 hover:bg-gray-200 text-gray-700",
        className
      )}
    >
      {children}
    </button>
  );
}

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gray-200 rounded",
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export function LoadingButton({ 
  isLoading = false, 
  loadingText = "Chargement...", 
  children, 
  disabled,
  className,
  ...props 
}: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all duration-200",
        "bg-blue-500 hover:bg-blue-600 text-white",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isLoading && "relative",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center space-x-2">
          <LoadingSpinner size="sm" />
          <span>{loadingText}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}