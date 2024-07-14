"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@/types";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "customer.displayName",
    header: "Customer",
  },
  {
    accessorKey: "book.title",
    header: "Book",
    cell: ({ row }) => {
      return (
        <Button asChild variant="link">
          <Link href={`/${row.original.book.ISBN}`}>
            {row.getValue("book_title")}
          </Link>
        </Button>
      );
    },
  },
  {
    accessorKey: "totalQuantity",
    header: "Copies",
  },
  {
    accessorKey: "totalPrice",
    header: "Total",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalPrice"));
      const formatted = new Intl.NumberFormat("en-US").format(amount);

      return <div>&#8358; {formatted}</div>;
    },
  },
];
