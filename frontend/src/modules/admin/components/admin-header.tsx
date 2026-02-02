"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { LogOut, Moon, Store, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";

const routeMap: Record<string, string> = {
  admin: "Dashboard",
  books: "Livros",
  categories: "Categorias",
  users: "Usuários",
  create: "Criar",
  edit: "Editar",
};

export function AdminHeader() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useUser();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex flex-1 items-center justify-between">
      <Breadcrumb className="hidden md:block">
        <BreadcrumbList>
          {paths.map((path, index) => {
            const isLast = index === paths.length - 1;
            const href = `/${paths.slice(0, index + 1).join("/")}`;
            const title = routeMap[path] || path;

            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={href}>{title}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-1 items-center justify-end gap-2 md:flex-initial">
        {/* Store Link */}
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <Store className="mr-2 size-4" />
            Ir para a Loja
          </Link>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="relative rounded-full"
        >
          <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute top-2.5 size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Alternar tema</span>
        </Button>

        {/* User Actions */}
        <div className="ml-2 flex items-center gap-2 border-l pl-2">
          {user && (
            <div className="hidden text-right text-sm md:block">
              <p className="font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="size-5" />
                <span className="sr-only">Sair</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sair do Sistema</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja sair do painel administrativo?
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
      </div>
    </div>
  );
}
