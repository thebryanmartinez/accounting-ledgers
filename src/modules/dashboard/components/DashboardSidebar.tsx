'use client';

import { ForwardRefExoticComponent, JSX, RefAttributes, useMemo } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import {
    BetweenHorizontalStartIcon,
    BookOpen,
    BookOpenTextIcon,
    Box,
    Building2,
    ChevronDown,
    Database,
    LucideProps,
} from 'lucide-react';

import { ACTIVE_COMPANY_ID_KEY } from '@/modules/companies/constants';
import {
    CollapsibleContent,
    CollapsibleTrigger,
    SidebarMenuSub,
    SidebarMenuSubItem,
    ThemeToggle,
} from '@/modules/shared/components';
import { Collapsible } from '@/modules/shared/components';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/modules/shared/components/select';
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
import { useLocale } from '@/modules/shared/components/LocaleProvider';

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
    const { locale, setLocale } = useLocale();
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
                <SidebarGroup>
                    <SidebarGroupLabel>{t('dashboard.language')}</SidebarGroupLabel>
                    <SidebarGroupContent className='flex flex-row gap-4'>
                        <Select
                            value={locale}
                            onValueChange={setLocale}
                        >
                            <SelectTrigger className='w-full'>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='en'>English</SelectItem>
                                <SelectItem value='es'>Español</SelectItem>
                            </SelectContent>
                        </Select>
                        <ThemeToggle />
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    );
}
