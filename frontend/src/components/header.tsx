"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import {
  BookOpen,
  LayoutDashboard,
  LogOut,
  Moon,
  ShoppingCart,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useState } from "react";
import { useCartStore } from "@/modules/cart/store/cart.store";
import { CartSheet } from "@/modules/cart/components/cart-sheet";

const navLinks = [
  { href: "/", label: "Home", active: true },
  { href: "/autores", label: "Autores" },
  { href: "/editoras", label: "Editoras" },
  { href: "/contato", label: "Contato" },
];

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useUser();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

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
            <Button
              key={link.href}
              variant="ghost"
              size="sm"
              asChild
              className={cn(
                link.active
                  ? "font-bold text-primary"
                  : "text-muted-foreground",
              )}
            >
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Admin Link */}
          {isAuthenticated && user?.role === "ADMIN" && (
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="rounded-full relative p-2 text-muted-foreground transition-colors hover:text-primary"
              aria-label="Painel Administrativo"
            >
              <Link href="/admin">
                <LayoutDashboard className="size-5" />
              </Link>
            </Button>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full relative p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label="Alternar tema"
          >
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute left-2 top-2 size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full relative p-2 text-muted-foreground transition-colors hover:text-primary"
            aria-label="Carrinho de compras"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart className="size-5" />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground animate-in zoom-in-50">
                {totalItems}
              </span>
            )}
          </Button>

          {/* Auth Buttons or User Profile */}
          <div className="flex items-center gap-3 border-l border-border pl-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 space-y-1 text-right">
                <div>
                  <p className="text-sm font-medium leading-none">
                    {user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      aria-label="Sair"
                    >
                      <LogOut className="size-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Sair</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja sair?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => logout()}>
                        Sair
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
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

      <CartSheet open={isCartOpen} onOpenChange={setIsCartOpen} />
    </header>
  );
}
