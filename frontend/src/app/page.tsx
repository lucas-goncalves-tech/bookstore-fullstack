import { Suspense } from "react";
import { Header } from "@/components/header";
import { HomeMain } from "@/modules/home/components/main";
import { HeroSection } from "@/modules/home/components/hero-section";
import { serverGet } from "@/lib/server-fetch";
import type { BooksResponse } from "@/modules/home/schemas/book.schema";
import { BookGridSkeleton } from "@/modules/home/components/book-grid";

export default async function Home() {
  const initialBooks = await serverGet<BooksResponse>("/books", {
    public: true,
    revalidate: 60,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <HeroSection />
      <Suspense fallback={
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 py-12">
          <BookGridSkeleton />
        </div>
      }>
        <HomeMain initialBooks={initialBooks} />
      </Suspense>
    </div>
  );
}
