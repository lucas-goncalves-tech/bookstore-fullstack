import { Suspense } from "react";
import { Header } from "@/components/header";
import { BookMain } from "@/modules/book/components/main";
import { serverGet } from "@/lib/server-fetch";
import type { BookDetail } from "@/modules/book/schemas/book.schema";
import type { BookReviewsResponse } from "@/modules/book/schemas/review.schema";
import { Loader2 } from "lucide-react";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookPage({ params }: BookPageProps) {
  const { id } = await params;

  const fetchOptions = { public: true, revalidate: 60 } as const;

  // Busca dados em paralelo no servidor
  const [initialBook, initialReviews] = await Promise.all([
    serverGet<BookDetail>(`/books/${id}`, fetchOptions),
    serverGet<BookReviewsResponse>(`/books/${id}/reviews`, fetchOptions),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <Suspense
        fallback={
          <main className="flex min-h-screen flex-1 items-center justify-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </main>
        }
      >
        <BookMain
          bookId={id}
          initialBook={initialBook}
          initialReviews={initialReviews}
        />
      </Suspense>
    </div>
  );
}
