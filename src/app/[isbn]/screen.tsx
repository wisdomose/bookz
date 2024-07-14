"use client";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { Book, CartItem, ROLES } from "@/types";
import Image from "next/image";
import { FiShoppingCart } from "react-icons/fi";
import Latest from "./Latest";
import { useEffect, useState } from "react";
import useFetcher from "@/hooks/useFetcher";
import CartService from "@/services/Cart";
import { toast } from "react-toastify";
import Quantity from "@/components/Quantity";

export default function Screen({ book: bookData }: { book: Book }) {
  const { cart, addToCart } = useCartStore((state) => state);
  const user = useUserStore((state) => state.user);
  const { wrapper, data, error, loading } = useFetcher<CartItem>();
  const [itemCart, setItemCart] = useState<CartItem | null>(null);

  useEffect(() => {
    const item = cart.find((item) => item.book.id === bookData.id);
    // @ts-ignore
    setItemCart(item);
  }, [cart, bookData]);

  async function addHandler() {
    const cartService = new CartService();
    await wrapper(() => cartService.add({ book: bookData, qty: 1 }));
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

  const book = itemCart ? itemCart.book : bookData;

  return (
    <>
      <div className="rounded-md flex flex-wrap flex-row gap-6 md:gap-10 lg:gap-20">
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

        <div className="flex flex-col justify-between gap-6">
          <h1 className="text-2xl font-medium">{book.title}</h1>

          <div className="flex flex-wrap gap-x-10 gap-y-2 items-center">
            <div className="">
              <p className="text-xs text-primary">Author</p>
              <p className="mt-2 truncate">{book.author}</p>
            </div>

            <div className="">
              <p className="text-xs text-primary">Publisher</p>
              <p className="mt-2 max-lg:max-w-[15ch] truncate">
                {book.publisher}
              </p>
            </div>

            <div className="">
              <p className="text-xs text-primary">Year</p>
              <p className="mt-2">{book.publicationYear}</p>
            </div>

            <div className="">
              <p className="text-xs text-primary">Quantity</p>
              <p className="mt-2">{book.stockQuantity} Pieces</p>
            </div>
          </div>

          <p className="">{book.description}</p>

          <div className="flex items-center gap-6">
            <p className="font-semibold text-2xl md:text-end mb-2">
              &#8358;{new Intl.NumberFormat("en-US").format(book.price)}
            </p>

            {user?.role != ROLES["ADMIN"] && (
              <>
                {itemCart ? (
                  <Quantity
                    book={itemCart.book}
                    id={itemCart.id}
                    qty={itemCart.qty}
                  />
                ) : (
                  <Button
                    className="flex gap-4 items-center px-5 rounded-none"
                    onClick={addHandler}
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
      <div className="grid md:grid-cols-[1fr,max-content] mt-16 gap-16 md:gap-20">
        <div className="">
          <h2 className="mb-5 font-medium text-2xl">Book details</h2>

          <div className="border border-black text-sm">
            {/* title */}
            <div className="grid grid-cols-[max-content,1fr] p-4 border-b border-black">
              <p className="text-left font-medium">Title</p>
              <p className="place-self-end text-right">{book.title}</p>
            </div>
            {/* author */}
            <div className="grid grid-cols-[max-content,1fr] p-4 border-b border-black">
              <p className="text-left font-medium">Author</p>
              <p className="place-self-end text-right">{book.author}</p>
            </div>
            {/* isbn */}
            <div className="grid grid-cols-[max-content,1fr] p-4 border-b border-black">
              <p className="text-left font-medium">ISBN</p>
              <p className="place-self-end text-right">{book.ISBN}</p>
            </div>
            {/* pages */}
            <div className="grid grid-cols-[max-content,1fr] p-4 border-b border-black">
              <p className="text-left font-medium">Pages</p>
              <p className="place-self-end text-right">{book.pages} pages</p>
            </div>
            {/* Language */}
            <div className="grid grid-cols-[max-content,1fr] p-4 border-b border-black">
              <p className="text-left font-medium">Language</p>
              <p className="place-self-end text-right">{book.language}</p>
            </div>
            {/* Book format */}
            <div className="grid grid-cols-[max-content,1fr] p-4 border-b border-black">
              <p className="text-left font-medium">Book format</p>
              <p className="place-self-end text-right">Paper back</p>
            </div>
            {/* Year of publication */}
            <div className="grid grid-cols-[max-content,1fr] p-4 border-b border-black">
              <p className="text-left font-medium">Year of publication</p>
              <p className="place-self-end text-right">
                {book.publicationYear}
              </p>
            </div>
            {/* Publisher */}
            <div className="grid grid-cols-[max-content,1fr] p-4">
              <p className="text-left font-medium">Publisher</p>
              <p className="place-self-end text-right">{book.publisher}</p>
            </div>
          </div>
        </div>

        <div className="">
          <h2 className="mb-5 font-medium text-2xl">Latest books</h2>

          <div className="flex flex-col gap-10">
            <Latest />
          </div>
        </div>
      </div>
    </>
  );
}
