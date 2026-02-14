"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BookError({ error, reset }: ErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error("[BookPage Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="mx-auto flex max-w-md flex-col items-center gap-6 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="size-8 text-destructive" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Erro ao carregar o livro
            </h1>
            <p className="text-muted-foreground">
              Não foi possível carregar os detalhes deste livro. Isso pode ser
              um problema temporário.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Voltar
            </Button>
            <Button onClick={reset} className="gap-2">
              <RotateCcw className="size-4" />
              Tentar novamente
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
