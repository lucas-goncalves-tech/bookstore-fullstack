import { cookies } from "next/headers";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ReviewList } from "@/modules/my-reviews/components/review-list";
import {
  myReviewsResponseSchema,
  MyReviewsResponse,
} from "@/modules/my-reviews/schemas/my-reviews.schema";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Minhas Avaliações | Bookstore",
  description: "Gerencie e edite suas opiniões sobre suas leituras recentes.",
};

async function fetchMyReviews(): Promise<MyReviewsResponse | null> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  try {
    const response = await fetch(`${process.env.API_URL}/reviews`, {
      headers: {
        Cookie: cookieHeader,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return myReviewsResponseSchema.parse(data);
  } catch {
    return null;
  }
}

export default async function MyReviewsPage() {
  const initialData = await fetchMyReviews();

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
