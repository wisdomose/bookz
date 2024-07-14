"use client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetcher from "@/hooks/useFetcher";
import BookService, { UploadResponse } from "@/services/Book";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiImage } from "react-icons/fi";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  publicationYear: z
    .number()
    .int()
    .min(0, "Publication year must be a positive integer"),
  genre: z.string().min(1, "Genre is required"),
  pages: z.number().int().min(1, "Pages must be a positive integer"),
  ISBN: z.string().min(1, "ISBN is required"),
  price: z.number().min(0, "Price must be a positive number"),
  publisher: z.string().min(1, "Publisher is required"),
  language: z.string().min(1, "Language is required"),
  description: z.string().min(1, "Description is required"),
  stockQuantity: z
    .number()
    .int()
    .min(0, "Stock quantity must be a non-negative integer"),
});

export default function UploadPage() {
  const { wrapper, data, loading, error } = useFetcher<UploadResponse>();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      publicationYear: 0,
      genre: "",
      pages: 0,
      ISBN: "",
      price: 0,
      publisher: "",
      language: "",
      description: "",
      stockQuantity: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!file) {
      toast.error("A cover image is required");
      return;
    }
    const bookService = new BookService();
    await wrapper(() =>
      bookService.upload({
        title: values.title,
        author: values.author,
        publicationYear: values.publicationYear,
        genre: values.genre,
        pages: values.pages,
        ISBN: values.ISBN,
        price: values.price,
        publisher: values.publisher,
        language: values.language,
        description: values.description,
        stockQuantity: values.stockQuantity,
        image: file,
      })
    );
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFile(file);
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (data) {
      toast.success("Book uploaded");
      form.reset();
      setFile(null);
      setPreview("");
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <>
      <Navbar />

      <main className="max-w py-16">
        <h1 className="text-2xl mt-3 mb-2">Uplod a new book</h1>
        <Form {...form}>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            {/* cover image */}
            <label
              htmlFor="cover"
              className="group block w-full h-40 ring-1 ring-black border-dashed relative cursor-pointer rounded-md"
            >
              <Input
                type="file"
                id="cover"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {preview && (
                <Image src={preview} alt="" fill className="object-contain" />
              )}
              <div
                className={`${
                  preview ? "hidden" : ""
                } bg-background/50 group-hover:flex group-focus:flex absolute inset-0 flex flex-col items-center justify-center gap-3`}
              >
                <FiImage className="size-6" />
                <p className="text-sm">
                  Select {preview ? "another" : "an"} image
                </p>
              </div>
            </label>

            <div className="grid grid-cols-2 gap-6">
              {/* description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel className="capitalize">description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="this book was made by bookz"
                      ></Textarea>
                    </FormControl>
                    {form.formState.errors["description"]?.message && (
                      <FormMessage>
                        {form.formState.errors["description"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="chronicles of bookz" />
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

              {/* year of publication */}
              <FormField
                control={form.control}
                name="publicationYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">
                      Year of publication
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                        placeholder={new Date().getFullYear().toString()}
                      />
                    </FormControl>
                    {form.formState.errors["publicationYear"]?.message && (
                      <FormMessage>
                        {form.formState.errors["publicationYear"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* publisher */}
              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">publisher</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John Doe" />
                    </FormControl>
                    {form.formState.errors["publisher"]?.message && (
                      <FormMessage>
                        {form.formState.errors["publisher"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* genre */}
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">genre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="comedy" />
                    </FormControl>
                    {form.formState.errors["genre"]?.message && (
                      <FormMessage>
                        {form.formState.errors["genre"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* pages */}
              <FormField
                control={form.control}
                name="pages"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">pages</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="100"
                        type="number"
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    {form.formState.errors["pages"]?.message && (
                      <FormMessage>
                        {form.formState.errors["pages"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* ISBN */}
              <FormField
                control={form.control}
                name="ISBN"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">ISBN</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="0000000000" />
                    </FormControl>
                    {form.formState.errors["ISBN"]?.message && (
                      <FormMessage>
                        {form.formState.errors["ISBN"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* language */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">language</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="kligon" />
                    </FormControl>
                    {form.formState.errors["language"]?.message && (
                      <FormMessage>
                        {form.formState.errors["language"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">price</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="100"
                        type="number"
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    {form.formState.errors["price"]?.message && (
                      <FormMessage>
                        {form.formState.errors["price"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />

              {/* stockQuantity */}
              <FormField
                control={form.control}
                name="stockQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">in stock</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="1"
                        type="number"
                        onChange={(event) =>
                          field.onChange(event.target.valueAsNumber)
                        }
                      />
                    </FormControl>
                    {form.formState.errors["stockQuantity"]?.message && (
                      <FormMessage>
                        {form.formState.errors["stockQuantity"]?.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-fit" disabled={loading}>
              {loading ? "loading" : "Upload book"}
            </Button>
          </form>
        </Form>
      </main>
    </>
  );
}
