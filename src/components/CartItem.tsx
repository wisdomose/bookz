"use client";
import { Book, CartItem } from "@/types";
import { Button } from "./ui/button";
import { FiMinus, FiPlus, FiShoppingCart, FiTrash } from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import useFetcher from "@/hooks/useFetcher";
import CartService from "@/services/Cart";
import Quantity from "./Quantity";

export default function CartItemDisplay({
  book,
  qty,
  id,
}: Pick<CartItem, "book" | "qty"> & { id?: string }) {
  const removeFetcher = useFetcher<boolean>();

  const { removeFromCart } = useCartStore((state) => state);

  async function removeHandler() {
    // remove from cart
    removeFromCart(book);

    // remove from backend
    if (id) {
      const cartService = new CartService();
      await removeFetcher.wrapper(() => cartService.remove(id));
    }
  }

  return (
    <div className="p-5 bg-white grid md:grid-cols-[1fr,max-content] gap-6 md:gap-10 lg:gap-20">
      <div className="flex gap-6 h-full">
        <div className="relative h-full w-full min-w-[150px] max-w-[150px] aspect-[2/3]">
          <Image
            src={book.coverImageUrl}
            alt=""
            fill
            className="object-cover"
          />
        </div>

        <div className="text-sm py-5 flex flex-col justify-between">
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
      <div className="flex h-full flex-col items-end justify-between md:py-5">
        <Quantity {...{ book, qty, id }} />

        <div className="">
          <p className="font-semibold text-2xl md:text-end mb-2">
            &#8358;{new Intl.NumberFormat("en-US").format(book.price)}
          </p>
          <Button
            className="flex gap-4 items-center px-5 rounded-none !border-red-500 text-red-500 hover:bg-red-500/5 bg-transparent"
            onClick={removeHandler}
            variant={"outline"}
            disabled={removeFetcher.loading}
          >
            <FiTrash />
            Remove from cart
          </Button>
        </div>
      </div>
    </div>
  );
}
