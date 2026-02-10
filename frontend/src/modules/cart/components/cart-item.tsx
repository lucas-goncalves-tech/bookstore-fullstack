import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useCartStore,
  type CartItem as CartItemType,
} from "../store/cart.store";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(item.price);

  return (
    <div className="flex gap-4 py-4">
      <div className="relative aspect-3/4 w-20 flex-none overflow-hidden rounded-lg border border-border bg-muted">
        {item.coverThumbUrl ? (
          <Image
            src={item.coverThumbUrl}
            alt={item.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl">
            📚
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h4 className="font-medium line-clamp-2 leading-tight">
            {item.title}
          </h4>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
            {item.author}
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="font-semibold">{formattedPrice}</p>

          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-lg border border-border">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-8 text-center text-sm">{item.quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-none"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.stock}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>

            <Button
              variant="destructive"
              size="icon"
              className="h-8 w-8"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
