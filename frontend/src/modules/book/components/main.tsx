"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { BookBreadcrumbs } from "./breadcrumbs";
import { BookCoverGallery } from "./book-cover-gallery";
import { BookDetails } from "./book-details";
import { BookPriceCard } from "./book-price-card";
import { BookDescriptionTabs } from "./book-description-tabs";
import { BookReviews } from "./book-reviews";
import { Footer } from "@/components/footer";
import { useBook } from "../hooks/use-book";
import type { BookDetail } from "../schemas/book.schema";

interface BookMainProps {
  bookId: string;
  initialBook?: BookDetail | null;
}

export function BookMain({ bookId, initialBook }: BookMainProps) {
  const router = useRouter();
  const { data: book, isLoading, isError } = useBook({
    id: bookId,
    initialData: initialBook,
  });

  useEffect(() => {
    if (isError || (!isLoading && !book)) {
      toast.error("Livro não encontrado ou erro ao carregar.");
      router.push("/");
    }
  }, [isError, isLoading, book, router]);

  if (isLoading && !book) {
    return (
      <main className="flex min-h-screen flex-1 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!book) return null;

  return (
    <main className="flex min-h-screen flex-1 flex-col">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">
        {/* Breadcrumbs */}
        <BookBreadcrumbs
          bookTitle={book.title}
          categoryName={book.category?.name}
          categoryId={book.category?.id}
        />

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 lg:gap-12">
          {/* Left Column: Visuals & Tabs */}
          <div className="flex flex-col gap-8 md:col-span-5 lg:col-span-4">
            <BookCoverGallery coverUrl={book.coverUrl} title={book.title} />
            <BookDescriptionTabs
              description={book.description}
              author={book.author}
            />
          </div>

          {/* Right Column: Details */}
          <div className="flex flex-col gap-8 md:col-span-7 lg:col-span-8">
            <BookDetails
              title={book.title}
              author={book.author}
              description={book.description}
              categoryName={book.category?.name}
              // Mock rating/reviews até API existir
              rating={4.8}
              reviewCount={124}
            >
              <BookPriceCard
                price={book.price}
                stock={book.stock}
                title={book.title}
              />
            </BookDetails>
          </div>
        </div>


        {/* Reviews */}
        <BookReviews bookId={book.id} />
      </div>

      <Footer />
    </main>
  );
}
