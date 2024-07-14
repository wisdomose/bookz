"use client";
import { books } from "@/mocks/books";
import { AddToCart, Book, CartItem } from "@/types";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type CartState = {
  cart: Pick<CartItem, "book" | "qty">[];
  addToCart: (book: AddToCart) => void;
  removeFromCart: (book: Book) => void;
  increment: (book: Book) => void;
  decrement: (book: Book) => void;
  total: () => string;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        addToCart: (item: AddToCart) =>
          set(({ cart }) => ({ cart: [...cart, item] })),
        removeFromCart: (book: Book) =>
          set(({ cart }) => {
            const filtered = cart.filter(
              (entry) => entry.book.ISBN != book.ISBN
            );

            return { cart: filtered };
          }),
        increment: (book: Book) =>
          set(({ cart }) => {
            const update = cart.map((item) => {
              if (item.book.ISBN === book.ISBN) {
                item.qty = item.qty + 1;
                return item;
              } else return item;
            });
            return { cart: update };
          }),
        decrement: (book: Book) =>
          set(({ cart }) => {
            const update = cart.map((item) => {
              if (item.book.ISBN === book.ISBN && item.qty > 1) {
                item.qty = item.qty - 1;
                return item;
              } else return item;
            });
            return { cart: update };
          }),

        total: () => {
          const cart = get().cart;
          const total =
            cart.length === 0
              ? 0
              : cart
                  .map((cart) => cart.qty * cart.book.price)
                  .reduce((a, b) => a + b);

          return Number.isInteger(total)
            ? total.toString()
            : total.toPrecision(3);
        },
      }),

      {
        name: "cart",
      }
    )
  )
);
