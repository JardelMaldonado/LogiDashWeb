"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function RotaAdmin({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const role = globalThis.window === undefined ? "" : localStorage.getItem("role") ?? "";

  useEffect(() => {
    if (role !== "ADMIN") {
      router.replace("/");
    }
  }, [role, router]);

  if (role !== "ADMIN") return null;

  return <>{children}</>;
}