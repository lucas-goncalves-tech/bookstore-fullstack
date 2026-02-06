"use client";

import { useCheckout } from "../hooks/use-checkout";
import { OrderSummary } from "./order-summary";
import { CheckoutItemList } from "./checkout-item-list";

export function CheckoutPage() {
  const { onSubmit, isSubmitting } = useCheckout();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-[1280px]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <CheckoutItemList />
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 sticky top-24">
          <OrderSummary isSubmitting={isSubmitting} onSubmit={onSubmit} />
        </div>
      </div>
    </div>
  );
}
