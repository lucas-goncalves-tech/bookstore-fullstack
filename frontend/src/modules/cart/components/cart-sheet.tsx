import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { useCartStore } from "../store/cart.store";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col w-full sm:max-w-md">
        <SheetHeader className="px-1">
          <SheetTitle>Carrinho ({totalItems})</SheetTitle>
          <SheetDescription>
            Revise seus itens antes de finalizar.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto -mr-6 pr-6 my-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground">
              <span className="text-4xl">🛒</span>
              <p>Seu carrinho está vazio.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="px-1 sm:justify-center">
            <CartSummary onClose={() => onOpenChange(false)} />
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
