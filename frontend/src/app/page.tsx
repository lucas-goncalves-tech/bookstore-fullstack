import { Header } from "@/components/header";
import { HomeMain } from "@/modules/home/components/main";
import type { BooksResponse } from "@/modules/home/schemas/book.schema";

async function getBooks(): Promise<BooksResponse | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/books`, {
      next: { revalidate: 60 }, // Revalida a cada 60 segundos
    });

    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

export default async function Home() {
  const initialBooks = await getBooks();

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <HomeMain initialBooks={initialBooks} />
    </div>
  );
}

