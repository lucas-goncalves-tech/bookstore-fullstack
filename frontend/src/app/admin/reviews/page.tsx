import { AdminReviewsClient } from "@/modules/admin/reviews/components/admin-reviews-client";
import { serverGet } from "@/lib/server-fetch";
import { AdminReviewsResponse } from "@/modules/admin/reviews/schemas/admin-review.schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciar Avaliações | Admin",
  description: "Gerencie as avaliações de livros da loja.",
};

export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  const initialData = await serverGet<AdminReviewsResponse>(
    "/admin/reviews?page=1&limit=10"
  );

  return <AdminReviewsClient initialData={initialData} />;
}
