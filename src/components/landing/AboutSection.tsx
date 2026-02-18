import { Target } from "lucide-react";

export function AboutSection() {
  return (
    <section id="about" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Target className="h-6 w-6 text-primary" />
          </div>

          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Our Mission
          </p>

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Why PayFlow Labs exists
          </h2>

          <div className="mt-8 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Payment flows are the most critical moment in any digital product
              — yet they&apos;re often an afterthought. A confusing checkout
              doesn&apos;t just lose a sale; it breaks trust.
            </p>
            <p>
              We built PayFlow Labs to bridge the gap between design best
              practices and real-world payment implementation. Our curated
              library of patterns, case studies, and components gives product
              teams the confidence to ship checkout experiences that users
              actually enjoy.
            </p>
            <p className="font-medium text-foreground">
              Because every pixel in the payment flow matters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
