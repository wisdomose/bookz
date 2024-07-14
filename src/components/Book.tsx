"use client";
import { Book, CartItem } from "@/types";
import { Button } from "./ui/button";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import useFetcher from "@/hooks/useFetcher";
import CartService, { AddToCartResponse } from "@/services/Cart";
import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Quantity from "./Quantity";

export default function BookDisplay({ book }: { book: Book }) {
  const { cart, addToCart } = useCartStore((state) => state);
  const { wrapper, data, error, loading } = useFetcher<CartItem>();
  const [itemCart, setItemCart] = useState<CartItem | null>(null);

  useEffect(() => {
    const item = cart.find((item) => item.book.id === book.id);
    // @ts-ignore
    setItemCart(item);
  }, [cart, book]);

  async function addHandler() {
    const cartService = new CartService();
    await wrapper(() => cartService.add({ book, qty: 1 }));
  }

  useEffect(() => {
    if (data) {
      addToCart(data);
      setItemCart(data);
      toast.success("Added sucessfully");
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  return (
    <div className="p-5 rounded-md bg-white flex flex-col md:flex-row justify-between gap-6 md:gap-10 lg:gap-20 md:items-end">
      <div className="flex gap-6 h-full">
        <div className="relative h-full w-full min-w-[150px] max-w-[150px] aspect-[2/3]">
          <Image
            sizes="lg"
            priority
            src={book.coverImageUrl}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="text-sm py-5">
          <div className="">
            <p className="text-xs text-primary">Title</p>
            <Link
              className="mt-2 text-base font-medium text-hover-focus"
              href={`/${book.ISBN}`}
            >
              {book.title}
            </Link>
          </div>

          <p className="py-6">{book.description}</p>

          <div className="hidden md:flex gap-10 items-center">
            <div className="">
              <p className="text-xs text-primary">Author</p>
              <p className="mt-2">{book.author}</p>
            </div>
            <div className="">
              <p className="text-xs text-primary">Quantity</p>
              <p className="mt-2">{book.stockQuantity} Pieces</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex gap-10 items-center">
        <div className="">
          <p className="text-xs text-primary">Author</p>
          <p className="mt-2">{book.author}</p>
        </div>
        <div className="">
          <p className="text-xs text-primary">Quantity</p>
          <p className="mt-2">{book.stockQuantity} Pieces</p>
        </div>
      </div>

      {/*  */}
      <div className="md:py-5 max-md:flex-row-reverse max-md:flex items-center max-md:justify-end gap-6">
        <p className="font-semibold text-2xl md:text-end mb-2">
          &#8358;{new Intl.NumberFormat("en-US").format(book.price)}
        </p>
        {itemCart ? (
          <Quantity book={itemCart.book} id={itemCart.id} qty={itemCart.qty} />
        ) : (
          <Button
            className="flex gap-4 items-center px-5 rounded-none"
            onClick={addHandler}
            disabled={loading}
          >
            <FiShoppingCart />
            Add to cart
          </Button>
        )}
      </div>
    </div>
  );
}
