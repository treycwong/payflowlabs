import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What kind of payment patterns are included?",
    answer:
      "PayFlow Labs covers a wide range of patterns — from single-page checkouts and multi-step wizards to subscription billing flows, mobile wallets, and one-click purchasing. Each pattern includes annotated screenshots, UX rationale, and implementation guidance.",
  },
  {
    question: "Is this for designers, developers, or both?",
    answer:
      "Primarily for product designers and UX professionals, but developers will find value in our component library and implementation notes. We bridge the gap between design intent and code reality.",
  },
  {
    question: "How often is the content updated?",
    answer:
      "We add new patterns and case studies every week. Our team continuously monitors the payment landscape — from emerging methods like BNPL to platform updates from Stripe, PayPal, and others.",
  },
  {
    question: "Can I use the components in production?",
    answer:
      "Absolutely. Our Figma components are royalty-free and designed for production use. They follow accessibility best practices and are tested across major browsers and devices.",
  },
  {
    question: "Do you offer team plans?",
    answer:
      "Yes! We offer team plans with shared workspaces, collaborative annotations, and priority support. Get in touch via the dashboard for custom pricing based on your team size.",
  },
];

export function FAQSection() {
  return (
    <section id="faq" className="border-t border-border/40 bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
