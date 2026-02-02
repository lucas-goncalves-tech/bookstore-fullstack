import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/modules/admin/components/app-sidebar"
import { AdminHeader } from "@/modules/admin/components/admin-header"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="flex h-16 items-center gap-4 border-b px-6 bg-background">
          <SidebarTrigger />
          <AdminHeader />
        </div>
        <div className="p-6">
            {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
