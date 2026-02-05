import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Book } from "@/modules/home/schemas/book.schema";
import { toast } from "sonner";

export interface CartItem extends Book {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book: Book) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === book.id);

        if (existingItem) {
          if (existingItem.quantity >= book.stock) {
            toast.error(
              `Estoque insuficiente! Apenas ${book.stock} disponíveis.`,
            );
            return;
          }

          set({
            items: currentItems.map((item) =>
              item.id === book.id
                ? { ...item, quantity: item.quantity + 1 }
                : item,
            ),
          });
          toast.success("Quantidade atualizada no carrinho!");
        } else {
          set({ items: [...currentItems, { ...book, quantity: 1 }] });
          toast.success("Adicionado ao carrinho!");
        }
      },

      removeItem: (bookId: string) => {
        set({
          items: get().items.filter((item) => item.id !== bookId),
        });
        toast.info("Item removido do carrinho.");
      },

      updateQuantity: (bookId: string, quantity: number) => {
        const { items } = get();
        const item = items.find((i) => i.id === bookId);

        if (!item) return;

        if (quantity > item.stock) {
          toast.error(`Estoque insuficiente! Máximo: ${item.stock}`);
          return;
        }

        if (quantity < 1) {
          get().removeItem(bookId);
          return;
        }

        set({
          items: items.map((item) =>
            item.id === bookId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "bookstore-cart",
    },
  ),
);
