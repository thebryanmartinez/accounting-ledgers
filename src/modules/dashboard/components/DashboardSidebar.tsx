"use client"

import Link from "next/link";
import {useMemo} from "react";
import {BookOpen, Building2, Database} from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/modules/shared/components/sidebar"
import {ACTIVE_COMPANY_ID_KEY} from "@/modules/companies/constants";
import {useLocalStorage} from "@/modules/shared/hooks";

export function DashboardSidebar() {
    const [activeCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, "")

    const items = useMemo(
        () => [
            {
                title: 'Companies',
                url: '/dashboard/companies',
                icon: Building2
            },
            {
                title: 'Diaries',
                url: `/dashboard/${activeCompanyId}/diaries`,
                icon: BookOpen
            },
            {
                title: 'Accounts',
                url: `/dashboard/${activeCompanyId}/accounts`,
                icon: Database
            }
        ],
        [activeCompanyId]
    )

    return (
        <Sidebar>
            <SidebarHeader/>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter/>
        </Sidebar>
    )
}