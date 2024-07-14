import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function OrderDisplay({ order }: { order: Order }) {
  const book = order.book;
  return (
    <div className="p-5 rounded-md bg-white flex flex-col md:flex-row justify-between gap-6 md:gap-10 lg:gap-20 md:items-end">
      <div className="flex gap-6 h-full">
        <div className="relative h-full w-full min-w-[150px] max-w-[150px] aspect-[2/3]">
          <Image
            priority
            sizes="lg"
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
              <p className="text-xs text-primary">Quantity</p>
              <p className="mt-2">{order.totalQuantity}</p>
            </div>
            <div className="">
              <p className="text-xs text-primary">Total</p>
              <p className="mt-2">&#8358;{new Intl.NumberFormat("en-US").format(order.totalPrice)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden flex gap-10 items-center">
        <div className="">
          <p className="text-xs text-primary">Quantity</p>
          <p className="mt-2">{order.totalQuantity} copies</p>
        </div>
        <div className="">
          <p className="text-xs text-primary">Total</p>
          <p className="mt-2">&#8358;{order.totalPrice}</p>
        </div>
      </div>
    </div>
  );
}
