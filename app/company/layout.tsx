import { AdminSidebar } from "@/components/sidebar/admin-sidebar";
import { DashboardHeader } from "@/components/sidebar/dashboard-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AdminSidebar />

      <SidebarInset>
        <DashboardHeader />

        <div className="p-2 pt-0 sm:gap-4 sm:p-4 w-full overflow-x-hidden">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
