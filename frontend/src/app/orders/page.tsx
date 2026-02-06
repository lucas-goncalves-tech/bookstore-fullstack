import { OrderList } from "@/modules/orders/history/components/order-list";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Meus Pedidos | Bookstore",
  description: "Visualize seu histórico de pedidos.",
};

export default function OrderHistoryPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-serif">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Meus Pedidos</h1>
            <p className="text-muted-foreground">
              Acompanhe o status e histórico de suas compras.
            </p>
          </div>
          <OrderList />
        </div>
      </main>
      <Footer />
    </div>
  );
}
