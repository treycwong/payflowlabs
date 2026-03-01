import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-20 text-center md:pb-32 md:pt-28">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Design better payment experiences</span>
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
          Payment flows that{" "}
          <span className="bg-gradient-to-r from-primary via-violet-600 to-indigo-600 bg-clip-text text-transparent">
            converts
          </span>
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl">
          Payment UX/UI patterns that comes with a simulator to help you design
          checkout experiences.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Button size="lg" className="gap-2 px-8" asChild>
            <Link href="/signup">
              Start Exploring
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="px-8" asChild>
            <Link href="/ebook">Free eBook</Link>
          </Button>
        </div>

        {/* Social proof */}
        <p className="mt-12 text-sm text-muted-foreground/70">
          Real-world examples from top-tier apps.
        </p>
      </div>
    </section>
  );
}
