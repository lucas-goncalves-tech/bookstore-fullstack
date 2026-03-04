"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useAdminBooks, AdminBookQueryParams } from "../hooks/use-books";
import { useDeleteBook } from "../hooks/use-delete-book";
import { useRestoreBook } from "../hooks/use-restore-book";
import { Book, BooksResponse } from "@/modules/home/schemas/book.schema";
import { Edit, MoreHorizontal, Archive, RefreshCcw } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { PriceSortOrder } from "@/modules/home/components/book-filter";
import { useMemo, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SkeletonBooksTable } from "./skeleton-books-table";
import { SimplePagination } from "@/components/simple-pagination";

interface BooksTableProps {
  onEdit: (book: Book) => void;
  initialData?: BooksResponse | null;
}

export function BooksTable({ onEdit, initialData }: BooksTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || undefined;
  const categorySlug = searchParams.get("categorySlug") || undefined;
  const sortOrder = (searchParams.get("sort") as PriceSortOrder) || "none";
  const minPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined;
  const maxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const params = useMemo<AdminBookQueryParams>(() => ({
    search,
    categorySlug,
    minPrice,
    maxPrice,
    page,
    limit,
  }), [search, categorySlug, minPrice, maxPrice, page, limit]);

  const { data, isLoading } = useAdminBooks(params, initialData);

  const sortedBooks = useMemo(() => {
    if (!data?.data) return [];
    if (sortOrder === "none") return data.data;

    return [...data.data].sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    });
  }, [data?.data, sortOrder]);
  const deleteBook = useDeleteBook();
  const restoreBook = useRestoreBook();

  const [bookToArchive, setBookToArchive] = useState<Book | null>(null);
  const [bookToRestore, setBookToRestore] = useState<Book | null>(null);

  if (isLoading && !data) {
    return <SkeletonBooksTable />;
  }

  const handleArchive = async () => {
    if (!bookToArchive) return;
    try {
      await deleteBook.mutateAsync(bookToArchive.id);
      setBookToArchive(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRestore = async () => {
    if (!bookToRestore) return;
    try {
      await restoreBook.mutateAsync(bookToRestore.id);
      setBookToRestore(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Capa</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBooks?.map((book) => (
              <TableRow key={book.id}>
                <TableCell>
                  <Avatar className="h-10 w-10 text-xs rounded-none">
                    <AvatarImage
                      src={book.coverThumbUrl || book.coverUrl || ""}
                      alt={book.title}
                    />
                    <AvatarFallback className="rounded-none">
                      IMG
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium max-w-[200px] truncate" title={book.title}>
                  {book.title}
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={book.author}>
                  {book.author}
                </TableCell>
                <TableCell>{book.category?.name ?? "Sem categoria"}</TableCell>
                <TableCell>
                  <Badge variant={book.deletedAt ? "secondary" : "default"}>
                    {book.deletedAt ? "Arquivado" : "Disponível"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(book.price)}
                </TableCell>
                <TableCell>
                  <Badge variant={book.stock > 0 ? "outline" : "destructive"}>
                    {book.stock}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Abrir menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(book)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {!book.deletedAt ? (
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => setBookToArchive(book)}
                        >
                          <Archive className="mr-2 h-4 w-4" />
                          Arquivar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => setBookToRestore(book)}
                        >
                          <RefreshCcw className="mr-2 h-4 w-4" />
                          Restaurar
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {(!data?.data || data.data.length === 0) && (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  Nenhum livro encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog: Archive */}
      <AlertDialog
        open={!!bookToArchive}
        onOpenChange={(open) => !open && setBookToArchive(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Arquivar Livro</AlertDialogTitle>
            <AlertDialogDescription>
              Isso arquivará o livro &quot;{bookToArchive?.title}&quot;, ocultando-o do
              catálogo da loja para os clientes. Você pode restaurá-lo
              posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleArchive}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteBook.isPending}
            >
              {deleteBook.isPending ? "Arquivando..." : "Arquivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Dialog: Restore */}
      <AlertDialog
        open={!!bookToRestore}
        onOpenChange={(open) => !open && setBookToRestore(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restaurar Livro</AlertDialogTitle>
            <AlertDialogDescription>
              O livro &quot;{bookToRestore?.title}&quot; voltará a
              aparecer no catálogo da loja imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRestore}
              disabled={restoreBook.isPending}
            >
              {restoreBook.isPending ? "Restaurando..." : "Restaurar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Simple Pagination */}
      <SimplePagination
        currentPage={page}
        totalPages={data?.metadata?.totalPages || 1}
        onPageChange={(newPage) => {
          const newParams = new URLSearchParams(searchParams.toString());
          if (newPage === 1) newParams.delete("page");
          else newParams.set("page", String(newPage));
          router.replace(`?${newParams.toString()}`, { scroll: false });
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
