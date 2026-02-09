import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ReviewList } from "@/modules/my-reviews/components/review-list";
import { serverGet } from "@/lib/server-fetch";
import type { MyReviewsResponse } from "@/modules/my-reviews/schemas/my-reviews.schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minhas Avaliações | Bookstore",
  description: "Gerencie e edite suas opiniões sobre suas leituras recentes.",
};

export const dynamic = "force-dynamic";

export default async function MyReviewsPage() {
  const initialData = await serverGet<MyReviewsResponse>("/reviews");

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b pb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight">
                Minhas Avaliações
              </h1>
              <p className="text-muted-foreground text-lg italic">
                Gerencie e edite suas opiniões sobre suas leituras recentes.
              </p>
            </div>
          </div>
          <ReviewList initialData={initialData} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
