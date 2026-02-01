"use client";

import { Star, PlusCircle } from "lucide-react";

// Mock data para reviews (backend ainda não implementado)
const mockReviews = [
  {
    id: "1",
    initials: "AS",
    name: "Ana Silva",
    date: "12 de Março, 2023",
    rating: 5,
    title: "Edição Maravilhosa!",
    content:
      "O livro é lindo, a capa dura é muito resistente e o acabamento é impecável. A entrega foi super rápida, chegou antes do prazo. Recomendo muito para quem quer colecionar.",
  },
  {
    id: "2",
    initials: "CM",
    name: "Carlos Mendes",
    date: "05 de Fevereiro, 2023",
    rating: 4,
    title: "Bom, mas cuidado com a entrega",
    content:
      "O conteúdo do livro dispensa comentários, é um clássico. Dei 4 estrelas porque a caixa chegou um pouco amassada no canto, mas felizmente não estragou o livro.",
  },
  {
    id: "3",
    initials: "MJ",
    name: "Mariana Jones",
    date: "28 de Janeiro, 2023",
    rating: 5,
    title: "Presente perfeito",
    content:
      "Comprei para dar de presente para meu sobrinho e ele amou. A diagramação está ótima para leitura.",
  },
];

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex text-primary">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${i < rating ? "fill-current" : "text-muted"}`}
        />
      ))}
    </div>
  );
}

interface BookReviewsProps {
  bookId: string;
}

export function BookReviews({ bookId }: BookReviewsProps) {
  // TODO: quando a rota de reviews existir no backend, usar useQuery aqui
  // Por enquanto, mostramos mock data como fallback
  const reviews = mockReviews;
  const totalReviews = 124; // Mock total

  // Suprime warning de bookId não utilizado (será usado quando API existir)
  void bookId;

  return (
    <div className="mb-12 mt-12">
      <h3 className="mb-8 text-2xl font-bold text-foreground">
        Avaliações de Clientes
      </h3>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Review Cards */}
        {reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-muted font-bold text-muted-foreground">
                  {review.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {review.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <ReviewStars rating={review.rating} />
            </div>

            <h4 className="mb-2 font-bold text-foreground">{review.title}</h4>
            <p className="text-sm text-muted-foreground">{review.content}</p>
          </div>
        ))}

        {/* Ver todas as avaliações */}
        <button className="group flex cursor-pointer items-center justify-center rounded-xl border border-border bg-card p-6 shadow-sm transition-colors hover:bg-muted">
          <div className="text-center">
            <PlusCircle className="mx-auto mb-2 size-10 text-primary transition-transform group-hover:scale-110" />
            <p className="font-bold text-primary">
              Ver todas as {totalReviews} avaliações
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}
