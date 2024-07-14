"use client";
import Loader from "@/components/Loader";
import useFetcher from "@/hooks/useFetcher";
import BookService from "@/services/Book";
import { Book } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import LatestBook from "@/components/LatestBook";

export default function Latest() {
  const { wrapper, data, error, loading } = useFetcher<Book[]>([]);
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const bookService = new BookService();
    wrapper(() => bookService.findAll(5));
  }, []);

  useEffect(() => {
    if (data) setBooks(data);
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <>
      {loading ? (
        <Loader label="Fetching books" />
      ) : books.length === 0 ? (
        <p>No new books have been added</p>
      ) : books.length > 0 ? (
        <>
          {books.map((book) => (
            <LatestBook book={book} key={book.ISBN} />
          ))}
        </>
      ) : null}
    </>
  );
}
