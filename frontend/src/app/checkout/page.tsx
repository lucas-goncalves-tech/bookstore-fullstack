import { CheckoutPage } from "@/modules/checkout/components/checkout-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finalizar Pedido | Bookstore",
  description: "Finalize sua compra na Bookstore.",
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
