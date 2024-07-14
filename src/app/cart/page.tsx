"use client";
import CartItemDisplay from "@/components/CartItem";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import PayButton from "@/components/PayButton";
import { Button } from "@/components/ui/button";
import useFetcher from "@/hooks/useFetcher";
import CartService from "@/services/Cart";
import { useCartStore } from "@/store/cart";
import { useUserStore } from "@/store/user";
import { CartItem, Customer } from "@/types";
import { useEffect } from "react";

export default function CartPage() {
  const { cart, total, addToCart } = useCartStore((state) => state);
  const user = useUserStore((state) => state.user) as Customer;
  const { wrapper, data, error, loading } = useFetcher<CartItem[]>();

  useEffect(() => {
    if (user) {
      const cartService = new CartService();
      wrapper(cartService.findAll);
    }
  }, [user]);

  // useEffect(() => {
  //   const existingIds = cart.map((item) => item.book.id);
  //   if (data) {
  //     const tobeAdded = data.filter(
  //       (item) => !existingIds.includes(item.book.id)
  //     );
  //     tobeAdded.forEach((item) => addToCart(item));
  //   }
  // }, [data]);

  return (
    <>
      <Navbar />

      <main className="max-w py-16">
        <h1 className="text-3xl font-medium mb-4">
          My cart {cart.length > 0 ? <span>({cart.length} items)</span> : null}
        </h1>

        {loading ? (
          <Loader label="Fetching cart" />
        ) : cart.length == 0 ? (
          <p className="text-center">Cart is empty</p>
        ) : (
          <div className="flex flex-col gap-[2px] rounded-md overflow-hidden">
            {cart.map((cart, index) => (
              <CartItemDisplay {...cart} key={cart.book.ISBN} />
            ))}
          </div>
        )}

        {user && cart.length > 0 && (
          <div className="mt-16 mb-6">
            <h2 className="font-medium tet-2xl mb-5">Cart summary</h2>

            <div className="border border-black text-sm max-w-md">
              <div className="grid grid-cols-[max-content,1fr] p-4 border-b border-black">
                <p className="font-medium">Address</p>
                <p className="place-self-end">{`${user?.address?.country}`}</p>
              </div>
              <div className="grid grid-cols-[max-content,1fr] p-4">
                <p className="font-medium">Subtotal</p>
                <p className="place-self-end">&#8358;{total()}</p>
              </div>
            </div>
          </div>
        )}

        {user && cart.length > 0 && <PayButton />}
      </main>
    </>
  );
}
