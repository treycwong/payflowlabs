import {
  LayoutGrid,
  TrendingUp,
  Smartphone,
  Shield,
  Globe,
  Palette,
} from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "Proven Patterns",
    description:
      "Battle-tested checkout flows from the world's top digital products, deconstructed for easy adoption.",
  },
  {
    icon: TrendingUp,
    title: "Conversion Optimization",
    description:
      "Data-driven insights on form design, micro-copy, and flow architecture that lift completion rates.",
  },
  {
    icon: Smartphone,
    title: "Mobile First Examples",
    description:
      "Responsive payment UIs optimized for thumb-friendly interactions and small-screen clarity.",
  },
  {
    icon: Shield,
    title: "Trust & Security UX",
    description:
      "Design patterns that build user confidence — badges, progress indicators, and error handling done right.",
  },
  {
    icon: Globe,
    title: "Global Payments",
    description:
      "Multi-currency, localization, and regional payment method patterns for worldwide audiences.",
  },
  {
    icon: Palette,
    title: "Component Library",
    description:
      "Ready-to-use UI kits and Figma components built specifically for payment and checkout interfaces.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Features
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Everything you need to ship great payment UX
          </h2>
          <p className="mt-4 text-muted-foreground">
            From research to implementation — a comprehensive toolkit for
            product designers building payment experiences.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/50 bg-background p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
