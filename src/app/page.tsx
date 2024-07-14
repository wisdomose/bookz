"use client";
import BookDisplay from "@/components/Book";
import Loader from "@/components/Loader";
import Navbar from "@/components/Navbar";
import useFetcher from "@/hooks/useFetcher";
import BookService, { FildAllBooksResponse } from "@/services/Book";
import { Book } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ShopPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const { wrapper, loading, data, error } = useFetcher<FildAllBooksResponse>();

  useEffect(() => {
    const bookService = new BookService();
    wrapper(bookService.findAll);
  }, []);

  useEffect(() => {
    if (data) {
      setBooks(data);
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
        <h1 className="text-3xl font-medium mb-4">Books</h1>

        {loading ? (
          <Loader label="Fetching books" />
        ) : books.length === 0 ? (
          <p className="text-center">No books found</p>
        ) : books.length > 0 ? (
          <div className="flex flex-col gap-6">
            {books.map((book) => (
              <BookDisplay book={book} key={book.ISBN} />
            ))}
          </div>
        ) : null}
      </main>
    </>
  );
}
