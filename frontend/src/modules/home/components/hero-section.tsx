"use client";

import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative w-full px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="group relative h-[500px] w-full overflow-hidden rounded-xl shadow-lg">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&q=80")`,
            }}
            aria-label="Cantinho aconchegante de leitura com livro e café"
          />

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center bg-linear-to-r from-black/70 to-transparent">
            <div className="max-w-2xl px-10 text-white md:px-16">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <BookOpen className="size-3" />
                Em destaque
              </span>

              <h2 className="mb-4 text-4xl font-black leading-tight drop-shadow-sm md:text-5xl lg:text-6xl">
                Encontre sua próxima grande aventura
              </h2>

              <p className="mb-8 max-w-[480px] text-lg font-light text-gray-200 md:text-xl">
                Uma seleção especial de clássicos e novidades para você
                redescobrir o prazer da leitura.
              </p>

              <Button
                size="lg"
                className="group/btn h-12 gap-2 px-8 text-base font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                <span>Explorar Coleção</span>
                <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
