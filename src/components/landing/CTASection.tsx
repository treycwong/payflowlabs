import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="border-t border-border/40 bg-muted/30 py-24">
      <div className="container mx-auto flex flex-col items-center gap-6 text-center px-6">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Ready to dive deep into payment flows?
        </h2>
        <p className="text-lg text-muted-foreground">Try it now.</p>
        <Button size="lg" asChild className="mt-2 px-8">
          <Link href="/signup">Get Started</Link>
        </Button>
      </div>
    </section>
  );
}
