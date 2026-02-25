import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/admin/components/app-sidebar";
import { AdminHeader } from "@/modules/admin/components/admin-header";
import { serverGet } from "@/lib/server-fetch";
import { redirect } from "next/navigation";
import type { User } from "@/hooks/use-user";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await serverGet<User>("/users/me");

  if (!user || user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex h-16 items-center gap-4 border-b px-6 bg-background">
          <SidebarTrigger />
          <AdminHeader />
        </div>
        <div className="p-6">{children}</div>
      </main>
    </SidebarProvider>
  );
}
