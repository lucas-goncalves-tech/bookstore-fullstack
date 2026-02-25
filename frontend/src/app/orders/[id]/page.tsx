import { OrderDetailsView } from "@/modules/orders/details/components/order-details";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";
import { serverGet } from "@/lib/server-fetch";
import type { OrderDetailResponse } from "@/modules/orders/schemas/order.response";

export const metadata: Metadata = {
  title: "Detalhes do Pedido | Bookstore",
  description: "Visualize os detalhes do seu pedido.",
};

interface OrderDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage({
  params,
}: OrderDetailsPageProps) {
  const { id } = await params;
  let order: OrderDetailResponse | null = null;
  
  try {
    order = await serverGet<OrderDetailResponse>(`/users/me/orders/${id}`);
  } catch {
    // Falls back gracefully on client error handling if API throws 404
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <OrderDetailsView orderId={id} initialData={order} />
      </main>
      <Footer />
    </div>
  );
}
