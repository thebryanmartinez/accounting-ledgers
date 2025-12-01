"use client";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/modules/shared/components/sidebar";
import { AuthGuard } from "@/modules/shared/components";
import { DashboardSidebar } from "@/modules/dashboard/components/DashboardSidebar";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Layout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard>
        <SidebarProvider>
          <DashboardSidebar />
          <main className="flex-1 h-full">
            <SidebarTrigger />
            <div className="px-8 py-4 h-full">{children}</div>
          </main>
        </SidebarProvider>
      </AuthGuard>
    </QueryClientProvider>
  );
}
