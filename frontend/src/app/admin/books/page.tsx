"use client"

import { Button } from "@/components/ui/button"
import { BooksTable } from "@/modules/admin/books/components/books-table"
import { Plus } from "lucide-react"
import { useState } from "react"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { BookForm } from "@/modules/admin/books/components/book-form"
import { Book } from "@/modules/home/schemas/book.schema"

export default function AdminBooksPage() {
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined)

    const handleEdit = (book: Book) => {
        setSelectedBook(book)
        setIsSheetOpen(true)
    }

    const handleCreate = () => {
        setSelectedBook(undefined)
        setIsSheetOpen(true)
    }

    const handleSheetOpenChange = (open: boolean) => {
        setIsSheetOpen(open)
        if (!open) setSelectedBook(undefined)
    }

    const handleSuccess = () => {
        setIsSheetOpen(false)
        setSelectedBook(undefined)
    }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gerenciar Livros</h1>
        <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Livro
        </Button>
      </div>

      <BooksTable onEdit={handleEdit} />

      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent className="overflow-y-auto sm:max-w-md w-full">
            <SheetHeader>
            <SheetTitle>{selectedBook ? "Editar Livro" : "Novo Livro"}</SheetTitle>
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
  )
}
