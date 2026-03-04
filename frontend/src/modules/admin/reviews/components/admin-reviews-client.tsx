"use client";

import { useState } from "react";
import { AdminReviewsTable } from "./admin-reviews-table";
import { AdminReviewsFilter } from "./admin-reviews-filter";
import { AdminReviewDetailsDialog } from "./admin-review-details-dialog";
import { AdminReview, AdminReviewsResponse } from "../schemas/admin-review.schema";

interface AdminReviewsClientProps {
  initialData?: AdminReviewsResponse | null;
}

export function AdminReviewsClient({ initialData }: AdminReviewsClientProps) {
  const [selectedReview, setSelectedReview] = useState<AdminReview | null>(null);

  const handleRowClick = (review: AdminReview) => {
    setSelectedReview(review);
  };

  const handleDialogChange = (open: boolean) => {
    if (!open) {
      setSelectedReview(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight px-1">Gerenciar Avaliações</h1>

      <div className="bg-card rounded-md border border-border shadow-sm px-4">
        <AdminReviewsFilter />
      </div>

      <AdminReviewsTable
        onRowClick={handleRowClick}
        initialData={initialData}
      />

      <AdminReviewDetailsDialog
        review={selectedReview}
        onOpenChange={handleDialogChange}
      />
    </div>
  );
}
