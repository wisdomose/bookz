"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Book } from "@/types";
import { useEffect, useState } from "react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import moment from "moment";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
});

type RequestBook = Pick<Book, "author" | "title"> & { timestamp: Date };

export default function RequestPage() {
  const [books, setBooks] = useState<RequestBook[]>([]);

  const addBook = (book: Pick<Book, "author" | "title">) => {
    setBooks((prevBooks) => {
      const newBooks = [...prevBooks, { ...book, timestamp: new Date() }];
      localStorage.setItem("books", JSON.stringify(newBooks));
      return newBooks;
    });
  };

  useEffect(() => {
    const storedBooks = localStorage.getItem("books");
    if (storedBooks) {
      console.log(JSON.parse(storedBooks));
      setBooks(JSON.parse(storedBooks));
    }
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    addBook(values);
    form.reset();
  }

  return (
    <>
      <Navbar />

      <div className="max-w py-5">
        <div className="flex justify-end">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Request a new Book</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Book</DialogTitle>
                <DialogDescription>Request a new book.</DialogDescription>
              </DialogHeader>

              <div className="">
                <Form {...form}>
                  <form
                    className="flex flex-col gap-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    {/* title */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">Title</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="chronicles of bookz"
                            />
                          </FormControl>
                          {form.formState.errors["title"]?.message && (
                            <FormMessage>
                              {form.formState.errors["title"]?.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* author */}
                    <FormField
                      control={form.control}
                      name="author"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">Author</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="John Doe" />
                          </FormControl>
                          {form.formState.errors["author"]?.message && (
                            <FormMessage>
                              {form.formState.errors["author"]?.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      disabled={
                        form.formState.isSubmitting || !form.formState.isValid
                      }
                    >
                      Place request
                    </Button>
                  </form>
                </Form>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Request date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {books.map((book) => (
                <TableRow key={book.title}>
                  <TableCell className="first-letter:capitalize">
                    {book.title}
                  </TableCell>
                  <TableCell className="capitalize">{book.author}</TableCell>
                  <TableCell>{moment(book.timestamp).format("LL")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
