import { Suspense } from "react";
import { Header } from "@/components/header";
import { HomeMain } from "@/modules/home/components/main";
import { serverGet } from "@/lib/server-fetch";
import type { BooksResponse } from "@/modules/home/schemas/book.schema";

export default async function Home() {
  const initialBooks = await serverGet<BooksResponse>("/books", {
    public: true,
    revalidate: 60,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <Suspense fallback={<div className="flex-1 animate-pulse bg-muted/20" />}>
        <HomeMain initialBooks={initialBooks} />
      </Suspense>
    </div>
  );
}
