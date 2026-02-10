import { BookOpen } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <BookOpen className="size-5 text-muted-foreground" />
          <span className="text-lg font-bold text-foreground">BookStore</span>
        </div>

        {/* Copyright */}
        <p className="text-center text-sm text-muted-foreground">
          © 2026 BookStore. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
