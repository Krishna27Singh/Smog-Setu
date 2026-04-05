import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { MobileNav } from "@/components/MobileNav";
import { Outlet } from "react-router-dom";

export function DashboardLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <div className="hidden md:block">
          <AppSidebar />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b border-border px-4 bg-card">
            <SidebarTrigger className="hidden md:flex" />
            <span className="ml-2 text-sm font-bold tracking-tight text-foreground md:hidden">SMOG SETU</span>
          </header>
          <main className="flex-1 overflow-auto p-4 pb-20 md:pb-4">
            <Outlet />
          </main>
        </div>
        <MobileNav />
      </div>
    </SidebarProvider>
  );
}
