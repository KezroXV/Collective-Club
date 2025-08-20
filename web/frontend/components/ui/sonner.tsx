"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";
import { cn } from "@/lib/utils";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className={cn("toaster group")}
      style={
        {
          "--normal-bg": "var(--background)",
          "--normal-text": "var(--foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      toastOptions={{
        duration: 2500,
        classNames: {
          toast:
            "group toast bg-white text-gray-900 border border-gray-200 rounded-xl shadow-lg p-4 dark:bg-neutral-900 dark:text-neutral-100 dark:border-neutral-800 data-[type=success]:border-green-500 data-[type=error]:border-red-500 data-[type=warning]:border-yellow-500",
          title: "text-[15px] font-semibold",
          description: "text-[13px] text-gray-600 dark:text-neutral-300",
          actionButton:
            "rounded-md bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 text-sm",
          cancelButton:
            "rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 px-3 py-1 text-sm",
          closeButton:
            "text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
