"use client";
import useFetcher from "@/hooks/useFetcher";
import CartService from "@/services/Cart";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { CartItem, ROLES } from "@/types";
import { useEffect } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { toast } from "react-toastify";

export default function Quantity({
  qty,
  id,
  book,
}: Pick<CartItem, "book" | "qty"> & { id?: string }) {
  const user = useUserStore((state) => state.user);
  const updateFetcher = useFetcher();

  const { decrement, increment } = useCartStore((state) => state);

  async function incrementHandler() {
    // increment from cart
    increment(book);

    // increment from backend
    if (id) {
      const cartService = new CartService();
      await updateFetcher.wrapper(() =>
        cartService.update({ id, qty: qty + 1 })
      );
    }
  }

  async function decrementHandler() {
    // decrement from cart
    decrement(book);

    // decrement from backend
    if (id) {
      const cartService = new CartService();
      await updateFetcher.wrapper(() =>
        cartService.update({ id, qty: qty - 1 === 0 ? 1 : qty - 1 })
      );
    }
  }

  useEffect(() => {
    if (updateFetcher.error) {
      toast.error(updateFetcher.error);
    }
  }, [updateFetcher.error]);

  if (user?.role === ROLES["ADMIN"]) return null;

  return (
    <div className="flex w-fit border border-primary">
      <button
        onClick={decrementHandler}
        className={`text-primary p-2 ${
          updateFetcher.loading
            ? "cursor-wait"
            : qty === 1
            ? "cursor-not-allowed"
            : ""
        }`}
        disabled={qty === 1 || updateFetcher.loading}
      >
        <FiMinus />
      </button>
      <button className="p-2">{qty}</button>
      <button
        className={`text-primary p-2 ${
          updateFetcher.loading
            ? "cursor-wait"
            : qty === book.stockQuantity
            ? "cursor-not-allowed"
            : ""
        }`}
        onClick={incrementHandler}
        disabled={qty === book.stockQuantity || updateFetcher.loading}
      >
        <FiPlus />
      </button>
    </div>
  );
}
