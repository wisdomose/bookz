"use client";

import useFetcher from "@/hooks/useFetcher";
import CartService from "@/services/Cart";
import { useCartStore } from "@/store/cart";
import { CartItem } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";

export default function SyncCart() {
  const { cart, addToCart } = useCartStore((store) => store);
  const [loggedin, setLoggedin] = useState(false);
  const { wrapper, loading, data, error } = useFetcher<CartItem[]>([]);

  useEffect(() => {
    onAuthStateChanged(getAuth(), async (user) => {
      if (user) {
        const carkService = new CartService();
        await wrapper(carkService.findAll);
        setLoggedin(true);
      }
    });
  }, []);

  useEffect(() => {
    if (loading || !loggedin) return;

    if (cart.length === 0 && data?.length === 0) return;

    // TODO: compare by quantity also
    const cartBookIds = cart.map((item) => item.book.id);
    const backendIds = (data ?? [])?.map((item) => item.book.id);

    const addToStore = data?.filter(
      (item) => !cartBookIds.includes(item.book.id)
    );
    const addToBacked = cart?.filter(
      (item) => !backendIds.includes(item.book.id)
    );

    // add to store
    addToStore.forEach((item) => addToCart(item));

    // add to cart backend
    const promises = addToBacked.map((item) => {
      return new Promise(async (res, rej) => {
        try {
          const cartService = new CartService();
          await cartService.add(item);
          res(true);
        } catch (error) {
          res(false);
        }
      });
    });

    (async () => {
      await Promise.all(promises);
    })();
  }, [data, loading, loggedin]);
  return <></>;
}
