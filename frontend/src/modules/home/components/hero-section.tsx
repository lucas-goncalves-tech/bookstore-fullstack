import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative w-full px-4 md:px-6 py-4 md:py-8">
      <div className="mx-auto max-w-7xl">
        <div className="group relative min-h-[400px] md:h-[500px] w-full overflow-hidden rounded-lg shadow-lg">
          {/* Background Image */}
          <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
            <Image
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=2000"
              alt="Muitos livros sobre a mesa"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
            />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 flex items-center bg-linear-to-r from-black/80 via-black/60 to-transparent">
            <div className="max-w-full px-6 text-white md:max-w-2xl md:px-16">
              <h2 className="mb-4 text-4xl font-black leading-tight drop-shadow-sm md:text-5xl lg:text-5xl xl:text-6xl">
                Encontre sua próxima grande aventura
              </h2>

              <p className="mb-6 max-w-md text-base font-light text-gray-200 md:mb-8 md:text-lg lg:text-xl">
                Uma seleção especial de clássicos e novidades para você
                redescobrir o prazer da leitura.
              </p>

              <Button
                size="lg"
                className="group/btn h-12 w-full md:w-auto gap-2 px-8 text-base font-bold shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
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
