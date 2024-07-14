"use client";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import useFetcher from "@/hooks/useFetcher";
import BookService from "@/services/Book";
import { Book } from "@/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Screen from "./screen";
import { useCartStore } from "@/store/cart";

export default function DetailPage() {
  const { isbn = "" } = useParams<{ isbn?: string }>() ?? {};
  const { wrapper, data, error, loading } = useFetcher<Book>();
  const [book, setBook] = useState<Book>();

  useEffect(() => {
    if (!isbn) return;
    const bookService = new BookService();
    wrapper(() => bookService.findOne(isbn));
  }, [isbn]);

  useEffect(() => {
    if (data) setBook(data);
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <>
      <Navbar />

      <main className="max-w py-16">
        {loading ? (
          <Loader label="Fetching book details" />
        ) : book ? (
          <Screen book={book} />
        ) : null}
      </main>
    </>
  );
}
