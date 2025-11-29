'use client';

import { ForwardRefExoticComponent, RefAttributes, useMemo } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import {
    BetweenHorizontalStartIcon,
    BookOpen,
    BookOpenTextIcon,
    Box,
    Building2,
    Database,
    LucideProps,
} from 'lucide-react';

import { ACTIVE_COMPANY_ID_KEY } from '@/modules/companies/constants';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/modules/shared/components/sidebar';
import { useLocalStorage } from '@/modules/shared/hooks';
import { SettingsDropdown } from '@/modules/dashboard/components/SettingsDropdown';

interface SidebarGroupsProps {
    label: string;
    links: Link[];
}

interface Link {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
}

const SidebarGroups = ({ label, links }: SidebarGroupsProps) => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {links.map((link) => (
                        <SidebarMenuItem key={link.title}>
                            <SidebarMenuButton asChild>
                                <Link href={link.url}>
                                    <link.icon />
                                    <span>{link.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export function DashboardSidebar() {
    const [activeCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');
    const t = useTranslations();

    const generalLinks = useMemo(
        () => [
            {
                title: t('dashboard.companies'),
                url: '/dashboard/companies',
                icon: Building2,
            },
            {
                title: t('dashboard.accounts'),
                url: `/dashboard/${activeCompanyId}/accounts`,
                icon: Database,
            },
            {
                title: t('dashboard.diaries'),
                url: `/dashboard/${activeCompanyId}/diaries`,
                icon: Box,
            },
        ],
        [activeCompanyId, t]
    );

    const entriesLinks = useMemo(
        () => [
            {
                title: t('dashboard.entries'),
                url: `/dashboard/${activeCompanyId}/entries`,
                icon: BetweenHorizontalStartIcon,
            },
        ],
        [activeCompanyId, t]
    );

    const ledgerLinks = useMemo(
        () => [
            {
                title: t('dashboard.generalJournal'),
                url: `/dashboard/${activeCompanyId}/general-journal`,
                icon: BookOpen,
            },
            {
                title: t('dashboard.generalLedger'),
                url: `/dashboard/${activeCompanyId}/general-ledger`,
                icon: BookOpenTextIcon,
            },
        ],
        [activeCompanyId, t]
    );

    return (
        <Sidebar>
            <SidebarHeader />
            <SidebarContent>
                <SidebarGroups label={t('dashboard.general')} links={generalLinks} />
                <SidebarGroups label={t('dashboard.accounting')} links={entriesLinks} />
                <SidebarGroups label={t('dashboard.ledgers')} links={ledgerLinks} />
            </SidebarContent>
            <SidebarFooter>
                <SettingsDropdown />
            </SidebarFooter>
        </Sidebar>
    );
}
