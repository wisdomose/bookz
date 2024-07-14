"use client"
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import useFetcher from "@/hooks/useFetcher";
import OrderService from "@/services/Order";
import { Order } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function TransactionPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const { wrapper, loading, data, error } = useFetcher<Order[]>();

  useEffect(() => {
    const orderService = new OrderService();
    wrapper(orderService.findAll);
  }, []);

  useEffect(() => {
    if (data) {
      setOrders(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <Navbar />

      <main className="max-w py-16">
        <h1 className="text-2xl mt-3 mb-2">Orders</h1>

        {loading ? (
          <Loader label="Fetching orders" />
        ) : orders.length === 0 ? (
          <p className="text-center">No orders found</p>
        ) : orders.length > 0 ? (
          <div className="flex flex-col gap-[2px] rounded-md overflow-hidden bg-white">
            <DataTable columns={columns} data={orders} />
          </div>
        ) : null}
      </main>
    </>
  );
}
