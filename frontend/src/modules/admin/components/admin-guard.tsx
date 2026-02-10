"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user?.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return null;
  }

  if (user?.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}
