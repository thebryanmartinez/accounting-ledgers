'use client';

import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CompanyProvider } from '@/modules/companies/contexts';
import { DashboardSidebar } from '@/modules/dashboard/components/DashboardSidebar';
import { AuthGuard } from '@/modules/shared/components';
import { SidebarProvider, SidebarTrigger } from '@/modules/shared/components/sidebar';

export default function Layout({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <AuthGuard>
                <CompanyProvider>
                    <SidebarProvider>
                        <DashboardSidebar />
                        <SidebarTrigger />
                        <main className='h-dvh w-full'>
                            <div className='px-8 py-4 flex flex-col h-full'>{children}</div>
                        </main>
                    </SidebarProvider>
                </CompanyProvider>
            </AuthGuard>
        </QueryClientProvider>
    );
}
