"use client";

import { Button } from "@/components/ui/button";
import { BooksTable } from "@/modules/admin/books/components/books-table";
import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { BookForm } from "@/modules/admin/books/components/book-form";
import { Book, BooksResponse } from "@/modules/home/schemas/book.schema";
import { useCategories } from "@/modules/home/hooks/use-categories";
import { AdminBookFilter } from "./admin-book-filter";

interface AdminBooksClientProps {
  initialData?: BooksResponse | null;
}

export function AdminBooksClient({ initialData }: AdminBooksClientProps) {
  const { data: categories = [] } = useCategories();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);

  const handleEdit = (book: Book) => {
    setSelectedBook(book);
    setIsSheetOpen(true);
  };

  const handleCreate = () => {
    setSelectedBook(undefined);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) setSelectedBook(undefined);
  };

  const handleSuccess = () => {
    setIsSheetOpen(false);
    setSelectedBook(undefined);
  };

  const actionButton = (
    <Button onClick={handleCreate} size="sm" className="h-9 w-full sm:w-auto">
      <Plus className="mr-2 h-4 w-4" />
      Novo Livro
    </Button>
  );

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight px-1">Gerenciar Livros</h1>

      <div className="bg-card rounded-md border border-border shadow-sm px-4">
        <AdminBookFilter categories={categories} actionButton={actionButton} />
      </div>

      <BooksTable onEdit={handleEdit} initialData={initialData} />

      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-full">
          <SheetHeader>
            <SheetTitle>
              {selectedBook ? "Editar Livro" : "Novo Livro"}
            </SheetTitle>
            <SheetDescription>
              {selectedBook
                ? "Faça alterações nos detalhes do livro abaixo."
                : "Preencha os detalhes para adicionar um novo livro ao catálogo."}
            </SheetDescription>
          </SheetHeader>
          <div className="py-4">
            <BookForm initialData={selectedBook} onSuccess={handleSuccess} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
