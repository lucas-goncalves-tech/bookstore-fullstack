import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/admin/components/app-sidebar";
import { AdminHeader } from "@/modules/admin/components/admin-header";
import { AdminGuard } from "@/modules/admin/components/admin-guard";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
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
    </AdminGuard>
  );
}
