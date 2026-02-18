import Link from "next/link";
import { Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Zap className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold">PayFlow Labs</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="#features"
              className="transition-colors hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#about"
              className="transition-colors hover:text-foreground"
            >
              About
            </a>
            <a href="#faq" className="transition-colors hover:text-foreground">
              FAQ
            </a>
            <Link
              href="/login"
              className="transition-colors hover:text-foreground"
            >
              Login
            </Link>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground/70">
          &copy; {new Date().getFullYear()} PayFlow Labs. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
