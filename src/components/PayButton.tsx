import useFetcher from "@/hooks/useFetcher";
import { Transaction, User } from "@/types";
import { useEffect, useMemo, useState } from "react";
import { PaystackButton, usePaystackPayment } from "react-paystack";
import { PaystackProps, callback } from "react-paystack/dist/types";
import { useUserStore } from "@/store/user";
import TransactionService from "@/services/Transaction";
import { Button } from "./ui/button";
import { useCartStore } from "@/store/cart";
import OrderService from "@/services/Order";

type Success = {
  reference: string;
  transaction: string;
};

export default function PayButton() {
  const amount = Number(useCartStore((state) => state.total)());
  const user = useUserStore((state) => state.user);
  const { wrapper, loading, data, error } = useFetcher<Omit<
    Transaction,
    "id"
  > | null>(null);
  const [initializing, setInitializing] = useState(false);

  //   fetch transactionId
  async function getTransactionId() {
    setInitializing(true);
    const transactionService = new TransactionService();
    await wrapper(() => transactionService.init({ amount }));
  }

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  if (user)
    return (
      <>
        <Button
          className="rounded-none"
          onClick={getTransactionId}
          disabled={loading}
        >
          Proceed to pay
          {data?.reference && (
            <Pay amount={amount} reference={data?.reference ?? ""} />
          )}
        </Button>
      </>
    );

  return null;
}

function Pay({
  amount,
  reference,
  onClose = () => {},
  onSuccess = () => {},
}: {
  amount: number; // in NGN not Kobo
  onSuccess?: () => void;
  onClose?: (prop: callback) => void;
  reference: string;
}) {
  const { wrapper, data, error, loading } = useFetcher();
  const user = useUserStore((state) => state.user);
  const config: PaystackProps = useMemo(
    () => ({
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_KEY ?? "",
      //   convert to kobo
      amount: amount * 100,
      // name: user ? user?.profile.lname + user?.profile.fname : "",
      email: user ? user.email : "",
      reference,
      // text: "",
    }),
    [reference]
  );

  const initializePayment = usePaystackPayment(config);

  useEffect(() => {
    if (!initializePayment) {
      console.log("nill");
      return;
    }

    initializePayment({
      onSuccess: (reference: Success) => {
        const orderService = new OrderService();
        wrapper(orderService.confirm);
      },
      onClose,
      config,
    });
  }, [initializePayment]);

  useEffect(() => {
    if (data) {
      useCartStore.persist.clearStorage();
      window.location.reload();
    }
  }, [data]);

  return <>{loading ? " loading" : ""}</>;
}
