"use client"

import Link from "next/link";
import {useMemo} from "react";
import {BookOpen, Building2, Database} from "lucide-react";
import {useTranslations} from "next-intl";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
    SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/modules/shared/components/sidebar"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/modules/shared/components/select"
import {ACTIVE_COMPANY_ID_KEY} from "@/modules/companies/constants";
import {useLocalStorage} from "@/modules/shared/hooks";
import {ThemeToggle} from "@/modules/shared/components";

export function DashboardSidebar() {
    const [activeCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, "")
    const [locale, setLocale] = useLocalStorage('locale', 'es')
    const t = useTranslations()

    const items = useMemo(
        () => [
            {
                title: t('dashboard.companies'),
                url: '/dashboard/companies',
                icon: Building2
            },
            {
                title: t('dashboard.diaries'),
                url: `/dashboard/${activeCompanyId}/diaries`,
                icon: BookOpen
            },
            {
                title: t('dashboard.accounts'),
                url: `/dashboard/${activeCompanyId}/accounts`,
                icon: Database
            }
        ],
        [activeCompanyId, t]
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
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupLabel>{t('dashboard.language')}</SidebarGroupLabel>
                    <SidebarGroupContent className="flex flex-row gap-4">
                        <Select value={locale} onValueChange={(value) => {
                            setLocale(value);
                            document.cookie = `locale=${value}; path=/; max-age=31536000`;
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                            </SelectContent>
                        </Select>
                        <ThemeToggle/>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}