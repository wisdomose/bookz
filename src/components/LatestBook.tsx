"use client";
import { useCartStore } from "@/store/cart";
import { Book, CartItem, ROLES } from "@/types";
import Image from "next/image";
import { Button } from "./ui/button";
import { FiShoppingCart } from "react-icons/fi";
import { useUserStore } from "@/store/user";
import Link from "next/link";
import useFetcher from "@/hooks/useFetcher";
import { useEffect, useState } from "react";
import CartService from "@/services/Cart";
import { toast } from "react-toastify";
import Quantity from "./Quantity";

export default function LatestBook({ book }: { book: Book }) {
  const { cart, addToCart } = useCartStore((state) => state);
  const user = useUserStore((state) => state.user);
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
    <div className="flex gap-3">
      <div className="relative h-full w-full min-w-[150px] max-w-[150px] aspect-[2/3]">
        <Image
          src={book.coverImageUrl}
          alt=""
          fill
          className="object-cover"
          priority
          sizes="lg"
        />
      </div>

      <div className="py-2 flex flex-col justify-between">
        <div className="">
          <Button
            asChild
            variant={"link"}
            className="p-0 text-base font-medium text-black"
          >
            <Link href={`/${book.ISBN}`}>{book.title}</Link>
          </Button>
          <p className="italic py-1">{book.author}</p>
          <p className="">{book.pages} pages</p>
        </div>

        <div className="">
          <p className="font-semibold text-2xl text-primary mb-3">
            &#8358;{new Intl.NumberFormat("en-US").format(book.price)}
          </p>
          {user?.role !== ROLES["ADMIN"] && (
            <>
              {itemCart ? (
                <Quantity
                  book={itemCart.book}
                  id={itemCart.id}
                  qty={itemCart.qty}
                />
              ) : (
                <Button
                  variant={"outline"}
                  className="flex gap-4 items-center px-5 rounded-none border-primary text-primary"
                  onClick={() => addToCart({ book, qty: 1 })}
                >
                  <FiShoppingCart />
                  Add to cart
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
