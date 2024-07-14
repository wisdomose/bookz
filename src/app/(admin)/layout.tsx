"use client";
import Spinner from "@/components/Spinner";
import UserService from "@/services/User";
import { useUserStore } from "@/store/user";
import { Admin, ROLES, User } from "@/types";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userService = new UserService();
        const profile = await userService.profile();

        // not an admin
        if (profile.role === ROLES["USER"]) {
          router.replace("/");
          return;
        }

        setUser(profile);
        setLoaded(true);
      } else router.replace("/");
    });
  }, []);

  if (loaded) return <>{children}</>;
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-5">
      <Spinner />
    </div>
  );
}
