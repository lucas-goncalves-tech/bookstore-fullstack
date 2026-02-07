import { Header } from "@/components/header";
import { BookMain } from "@/modules/book/components/main";
import type { BookDetail } from "@/modules/book/schemas/book.schema";
import type { BookReviewsResponse } from "@/modules/book/schemas/review.schema";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

async function getBook(id: string): Promise<BookDetail | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/books/${id}`, {
      next: { revalidate: 60 }, // Revalida a cada 60 segundos
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

async function getBookReviews(id: string): Promise<BookReviewsResponse | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/books/${id}/reviews`, {
      next: { revalidate: 60 }, // Revalida a cada 60 segundos
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  // Busca dados em paralelo no servidor
  const [initialBook, initialReviews] = await Promise.all([
    getBook(id),
    getBookReviews(id),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <BookMain
        bookId={id}
        initialBook={initialBook}
        initialReviews={initialReviews}
      />
    </div>
  );
}
