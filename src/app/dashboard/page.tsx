import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";
import { CheckCircle2, Zap } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Minimal header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">
              PayFlow Labs
            </span>
          </Link>
          <SignOutButton />
        </div>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Connected</h1>
          <p className="mt-3 text-lg text-muted-foreground">
            Welcome to the PayFlow Labs Dashboard.
          </p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Signed in as{" "}
            <span className="font-medium text-foreground">{user.email}</span>
          </p>
        </div>
      </main>
    </div>
  );
}
