"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  isMobile?: boolean;
}

export function ThemeToggle({ className, isMobile = false }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  return (
    <div
      className={cn(
        "flex items-center rounded-lg border border-white/5 bg-white/10 p-1",
        isMobile && "flex-1 p-0.5",
        className,
      )}
    >
      <Button
        variant={!isDark ? "secondary" : "ghost"}
        size={isMobile ? "sm" : "icon-sm"}
        onClick={() => setTheme("light")}
        className={cn(
          "cursor-pointer rounded-md p-1.5 transition-all select-none",
          !isDark
            ? "text-brand-900 bg-white shadow-sm hover:bg-white/90"
            : "text-white/70 hover:bg-white/10 hover:text-white",
          isMobile &&
            "flex flex-1 items-center justify-center gap-1 py-1 text-[10px] font-bold sm:text-xs",
        )}
        title="Light Mode"
      >
        <Sun className="h-4 w-4 shrink-0" />
        {isMobile && <span>Sáng</span>}
      </Button>
      <Button
        variant={isDark ? "secondary" : "ghost"}
        size={isMobile ? "sm" : "icon-sm"}
        onClick={() => setTheme("dark")}
        className={cn(
          "cursor-pointer rounded-md p-1.5 transition-all select-none",
          isDark
            ? "text-brand-900 bg-white shadow-sm hover:bg-white/90"
            : "text-white/70 hover:bg-white/10 hover:text-white",
          isMobile &&
            "flex flex-1 items-center justify-center gap-1 py-1 text-[10px] font-bold sm:text-xs",
        )}
        title="Dark Mode"
      >
        <Moon className="h-4 w-4 shrink-0" />
        {isMobile && <span>Tối</span>}
      </Button>
    </div>
  );
}
