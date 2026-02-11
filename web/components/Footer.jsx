"use client";

import Link from "next/link";
import { Cpu, Github, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Cpu className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">Decision Fatigue Reducer</span>
          </Link>

          <p className="text-xs text-muted-foreground">
            <a
              href="https://github.com/blezecon/X0R_AMUHACKS5.0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4 shrink-0" />
              <span>Made by Team X0R</span>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
