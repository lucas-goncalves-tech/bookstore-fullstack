"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminReviews } from "../hooks/use-admin-reviews";
import { AdminReview, AdminReviewsResponse } from "../schemas/admin-review.schema";
import { Skeleton } from "@/components/ui/skeleton";
import { SimplePagination } from "@/components/simple-pagination";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { AdminReviewActionsDropdown } from "./admin-review-actions-dropdown";
import { Star } from "lucide-react";

interface AdminReviewsTableProps {
  onRowClick: (review: AdminReview) => void;
  initialData?: AdminReviewsResponse | null;
}

export function AdminReviewsTable({ onRowClick, initialData }: AdminReviewsTableProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || undefined;
  const order = (searchParams.get("order") as "asc" | "desc") || undefined;
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;

  const params = useMemo(() => ({
    search,
    order,
    page,
    limit,
  }), [search, order, page, limit]);

  const { data, isLoading } = useAdminReviews(params, initialData);

  const totalPages = data?.metadata?.totalPages || 1;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Livro</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead className="w-[120px]">Nota</TableHead>
              <TableHead className="w-[300px]">Comentário</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[80px]" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-md ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.data?.map((review) => (
              <TableRow 
                key={review.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onRowClick(review)}
              >
                <TableCell className="font-medium max-w-[200px] truncate" title={review.book.title}>
                  {review.book.title}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={review.user.email}>
                  <div className="flex flex-col">
                    <span className="text-sm">{review.user.name}</span>
                    <span className="text-xs text-muted-foreground">{review.user.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium">{review.rating}</span>
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  </div>
                </TableCell>
                <TableCell className="max-w-[300px] truncate text-muted-foreground">
                  {review.comment ? (
                    review.comment
                  ) : (
                    <span className="italic">Sem comentário</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <AdminReviewActionsDropdown review={review} />
                </TableCell>
              </TableRow>
            ))}
            {(!data?.data || data.data.length === 0) && !isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  Nenhuma avaliação encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <SimplePagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          const newParams = new URLSearchParams(searchParams.toString());
          if (newPage === 1) newParams.delete("page");
          else newParams.set("page", String(newPage));
          router.push(`?${newParams.toString()}`, { scroll: false });
        }}
        isLoading={isLoading}
      />
    </div>
  );
}
