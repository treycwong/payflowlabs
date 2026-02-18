import Link from "next/link";
import { Zap } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2 transition-opacity hover:opacity-80"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4.5 w-4.5 text-primary-foreground" />
        </div>
        <span className="text-xl font-semibold tracking-tight">
          PayFlow Labs
        </span>
      </Link>
      {children}
    </div>
  );
}
