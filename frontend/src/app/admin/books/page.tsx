import { AdminBooksClient } from "@/modules/admin/books/components/admin-books-client";
import { serverGet } from "@/lib/server-fetch";
import { BooksResponse } from "@/modules/home/schemas/book.schema";

export const dynamic = "force-dynamic";

export default async function AdminBooksPage() {
  const initialData = await serverGet<BooksResponse>("/books?page=1&limit=10");

  return <AdminBooksClient initialData={initialData} />;
}
