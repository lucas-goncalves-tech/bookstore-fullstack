"use client";

import Link from "next/link";
import { BookOpen, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Placeholder: usuário não logado por enquanto
const isLoggedIn = false;

const navLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/livros", label: "Livros" },
  { href: "/autores", label: "Autores" },
  { href: "/editoras", label: "Editoras" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="group flex cursor-pointer items-center gap-3">
          <BookOpen className="size-8 text-primary" />
          <h1 className="text-2xl font-black tracking-tight text-foreground transition-colors group-hover:text-primary">
            BookStore
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                link.active
                  ? "border-b-2 border-primary pb-0.5 font-bold text-primary"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Cart */}
          <button
            className="relative p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label="Carrinho de compras"
          >
            <ShoppingCart className="size-5" />
            <span className="absolute right-0 top-1 size-2 rounded-full bg-primary" />
          </button>

          {/* Auth Buttons or User Profile */}
          <div className="flex items-center gap-3 border-l border-border pl-4">
            {isLoggedIn ? (
              <>
                <span className="hidden text-sm font-bold text-foreground lg:block">
                  John Doe
                </span>
                <div
                  className="size-10 cursor-pointer rounded-full border-2 border-white bg-cover bg-center shadow-md transition-colors hover:border-primary"
                  style={{
                    backgroundImage: `url("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop")`,
                  }}
                  aria-label="Avatar do usuário"
                />
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth">Entrar</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/auth/register">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
