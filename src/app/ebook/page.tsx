"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Download, CheckCircle2 } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function EbookPage() {
  const chapters = [
    { title: "Digital Payments", subtitle: "Apple Pay, Google Pay, GrabPay" },
    {
      title: "Card Payments & 3D Secure",
      subtitle: "Streamlining authentication flows",
    },
    {
      title: "E-Commerce Checkout",
      subtitle: "Shopify-style one-page checkout",
    },
    {
      title: "Bookings & Hospitality",
      subtitle: "Airbnb’s approaches to complex bookings",
    },
    {
      title: "Rewards, Points & Vouchers",
      subtitle: "Reducing friction with discounts",
    },
    { title: "Crypto Wallet Payments", subtitle: "On-chain transactionUX" },
    {
      title: "QR Payments & DuitNow",
      subtitle: "Designing instant bank transfer UX",
    },
    {
      title: "PayLater (Buy Now Pay Later)",
      subtitle: "Atome, Klarna, Affirm patterns",
    },
    {
      title: "Edge Cases & Error Handling",
      subtitle: "Designing for timeouts and failures",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="pointer-events-none absolute inset-0 -z-10">
            <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
            <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-violet-500/5 blur-3xl" />
          </div>

          <div className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-20 text-center md:pb-32 md:pt-28">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse mr-1"></span>
              <span>Expanded Edition 2025</span>
            </div>

            {/* Headline */}
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              Mastering Payment UX Design
            </h1>

            {/* Subtext */}
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
              A complete guide to payment flows, UX best practices, and handling
              edge cases based on analysis of the world's leading apps.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="gap-2 px-8"
                onClick={() =>
                  window.open(
                    "/Mastering_Payment_UX_Design_Expanded.pdf",
                    "_blank",
                  )
                }
              >
                <Download className="w-4 h-4" />
                Download Free PDF
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="gap-2 px-8"
                asChild
              >
                <a href="#contents">
                  <BookOpen className="w-4 h-4" />
                  View Contents
                </a>
              </Button>
            </div>

            {/* Book Cover Image */}
            {/* <div className="mt-16 w-full max-w-2xl mx-auto">
              <div className="relative aspect-[3/4] md:aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <Image
                  src="/mastering payment ux design.jpg"
                  alt="Mastering Payment UX Design Book Cover"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
                  priority
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none" />
              </div>
            </div> */}
          </div>
        </section>

        {/* About Section */}
        <section className="py-24 bg-muted/30 relative overflow-hidden">
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 md:text-4xl">
                Why This Book Matters
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Payment UX is the single most conversion-critical surface in any
                digital product.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-background/50 backdrop-blur-sm border border-border/40 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-rose-500/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-rose-500">70%</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Cart Abandonment</h3>
                <p className="text-muted-foreground">
                  Friction-filled checkouts cost revenue. The majority of the
                  average 70% cart abandonment rate is payment-related friction.
                </p>
              </div>

              <div className="bg-background/50 backdrop-blur-sm border border-border/40 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-amber-500">13%</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Lost to Bad Copy</h3>
                <p className="text-muted-foreground">
                  Error messages account for 13% of failed transactions solely
                  because they are phrased poorly. An unclear error screen costs
                  trust.
                </p>
              </div>

              <div className="bg-background/50 backdrop-blur-sm border border-border/40 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
                  <span className="text-xl font-bold text-emerald-500">
                    ROI
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  Distilled Best Practices
                </h3>
                <p className="text-muted-foreground">
                  Learn actionable patterns from leading platforms like Apple
                  Pay, Shopify, GrabPay, and more that you can instantly apply.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Table of Contents Section */}
        <section id="contents" className="py-24 relative block bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4 md:text-4xl">
                Inside the Book
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Nine focused chapters covering the mechanics, ideal flows, UI
                best practices, and edge cases of modern digital payments.
              </p>
            </div>

            <div className="relative border-l-2 border-border/50 pb-8 ml-4 md:ml-8">
              {chapters.map((chapter, index) => (
                <div key={index} className="mb-12 ml-10 group">
                  <span className="absolute flex items-center justify-center w-10 h-10 rounded-full -left-[21px] ring-8 ring-background bg-muted text-muted-foreground font-semibold text-base transition-colors group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 duration-300">
                    {index + 1}
                  </span>
                  <div className="pt-1">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {chapter.title}
                    </h3>
                    <p className="text-lg text-muted-foreground">
                      {chapter.subtitle}
                    </p>
                  </div>
                </div>
              ))}
              <div className="ml-10 mt-16 text-base font-medium text-primary flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Plus a Quick Reference UX Checklist
              </div>
            </div>

            {/* <div className="mt-16 text-center">
              <Button
                size="lg"
                className="gap-2 px-8"
                onClick={() =>
                  window.open(
                    "/Mastering_Payment_UX_Design_Expanded.pdf",
                    "_blank",
                  )
                }
              >
                <Download className="w-4 h-4" />
                Download Full Table of Contents
              </Button>
            </div> */}
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/40 bg-muted/30 py-24">
          <div className="container mx-auto flex flex-col items-center gap-6 text-center px-6">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Put these principles into practice.
            </h2>
            <p className="text-lg text-muted-foreground">
              You've read the theory. Now build world-class payment flows
              effortlessly with PayFlow Labs.
            </p>
            <Button size="lg" asChild className="mt-2 px-8">
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
