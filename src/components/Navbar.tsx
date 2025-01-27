"use client";
import { useUserStore } from "@/store/user";
import Image from "next/image";
import Link from "next/link";
import { FiLogOut, FiShoppingCart } from "react-icons/fi";
import { Button } from "./ui/button";
import { getAuth, signOut } from "firebase/auth";
import { ROLES } from "@/types";

export default function Navbar() {
  const user = useUserStore((state) => state.user);

  async function logout() {
    await signOut(getAuth());
    useUserStore.persist.clearStorage();
    window.location.reload();
  }

  return (
    <nav className="bg-white py-5">
      <div className="max-w">
        <Image
          alt="logo"
          src="/logo.png"
          width={80}
          height={80}
          className="object-contain mx-auto max-md:w-20 max-md:h-20"
          priority
        />

        <div className="flex gap-6 items-center justify-center mt-6">
          <Button asChild variant={"link"}>
            <Link href="/">Shop</Link>
          </Button>
          {user && user.role === ROLES["USER"] && (
            <Button asChild variant={"link"}>
              <Link href="/orders">Orders</Link>
            </Button>
          )}
          {user && user.role === ROLES["ADMIN"] && (
            <Button asChild variant={"link"}>
              <Link href="/transactions">Orders</Link>
            </Button>
          )}
          {user && user.role === ROLES["ADMIN"] && (
            <Button asChild variant={"link"}>
              <Link href="/upload">Upload</Link>
            </Button>
          )}
           <Button asChild variant={"link"}>
              <Link href="/request">Request</Link>
            </Button>
          {!user && (
            <Button asChild variant={"link"}>
              <Link href="/login">Login</Link>
            </Button>
          )}
          {!user && (
            <Button asChild>
              <Link href="/signup">Signup</Link>
            </Button>
          )}
          {(!user || user.role != ROLES["ADMIN"]) && (
            <Button asChild variant={"ghost"}>
              <Link href="/cart">
                <FiShoppingCart />
              </Link>
            </Button>
          )}
          {user && (
            <Button variant={"ghost"} onClick={logout}>
              <FiLogOut />
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
