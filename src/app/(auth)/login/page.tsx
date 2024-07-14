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
import useFetcher from "@/hooks/useFetcher";
import UserService, { LoginResponse } from "@/services/User";
import { useUserStore } from "@/store/user";
import { Customer } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiLock } from "react-icons/fi";
import { toast } from "react-toastify";
import { z } from "zod";

const formSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password should be at least 6 characters"),
});

export default function LoginPage() {
  const { wrapper, data, loading, error } = useFetcher<LoginResponse>(null);
  const { setUser } = useUserStore((state) => state);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const userService = new UserService();
    await wrapper(() =>
      userService.login({
        email: values.email,
        password: values.password,
      })
    );
    console.log(values);
  }

  useEffect(() => {
    if (data) {
      setUser(data as Customer);
      window.location.href = "/";
    }
  }, [data]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <>
      <Navbar />

      <main className="max-w mt-16 pb-10">
        <Form {...form}>
          <form
            className="flex flex-col gap-6 max-w-md mx-auto"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col">
              {/* <FiLock className="size-16 mx-auto text-primary" /> */}
              <h1 className="text-4xl mt-3">Login</h1>
            </div>
            {/* email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="johndoe@bookz.com" />
                  </FormControl>
                  {form.formState.errors["email"]?.message && (
                    <FormMessage>
                      {form.formState.errors["email"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="******" />
                  </FormControl>
                  {form.formState.errors["password"]?.message && (
                    <FormMessage>
                      {form.formState.errors["password"]?.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <Button type="submit">Login</Button>

            <p className="text-center">
              don&apos;t have an account?{" "}
              <Link href="/signup" className="text-hover-focus underline">
                sign up
              </Link>
            </p>
          </form>
        </Form>
      </main>
    </>
  );
}
