'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import {
    BetweenHorizontalStartIcon,
    BookOpen,
    BookOpenTextIcon,
    Box,
    Building2,
    Database,
} from 'lucide-react';

import { useActiveCompany } from '@/modules/companies/contexts';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from '@/modules/shared/components/sidebar';
import { SettingsDropdown } from '@/modules/dashboard/components/SettingsDropdown';
import { SidebarLinkWithTooltip } from '@/modules/dashboard/components/SidebarLinkWithTooltip';
import { useSidebarValidation } from '@/modules/dashboard/hooks/useSidebarValidation';
import { SidebarGroupConfig } from '@/modules/dashboard/models/sidebar.model';

const SidebarGroups = ({ label, links }: SidebarGroupConfig) => {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>{label}</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {links.map((link) => (
                        <SidebarMenuItem key={link.title}>
                            <SidebarLinkWithTooltip link={link} />
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};

export function DashboardSidebar() {
    const { activeCompanyId } = useActiveCompany();
    const { permissions, validationState } = useSidebarValidation();
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
                disabled: !permissions.canViewAccounts,
                tooltipContent: !permissions.canViewAccounts
                    ? t('dashboard.tooltips.requiresCompany')
                    : undefined,
            },
            {
                title: t('dashboard.diaries'),
                url: `/dashboard/${activeCompanyId}/diaries`,
                icon: Box,
                disabled: !permissions.canViewDiaries,
                tooltipContent: !permissions.canViewDiaries
                    ? !validationState.hasActiveCompany
                        ? t('dashboard.tooltips.requiresCompany')
                        : t('dashboard.tooltips.requiresAccounts')
                    : undefined,
            },
        ],
        [activeCompanyId, permissions, validationState, t]
    );

    const entriesLinks = useMemo(
        () => [
            {
                title: t('dashboard.entries'),
                url: `/dashboard/${activeCompanyId}/entries`,
                icon: BetweenHorizontalStartIcon,
                disabled: !permissions.canViewEntries,
                tooltipContent: !permissions.canViewEntries
                    ? !validationState.hasActiveCompany
                        ? t('dashboard.tooltips.requiresCompany')
                        : t('dashboard.tooltips.requiresAccounts')
                    : undefined,
            },
        ],
        [activeCompanyId, permissions, validationState, t]
    );

    const ledgerLinks = useMemo(
        () => [
            {
                title: t('dashboard.generalJournal'),
                url: `/dashboard/${activeCompanyId}/general-journal`,
                icon: BookOpen,
                disabled: !permissions.canViewLedgers,
                tooltipContent: !permissions.canViewLedgers
                    ? !validationState.hasActiveCompany
                        ? t('dashboard.tooltips.requiresCompany')
                        : !validationState.hasAccounts
                          ? t('dashboard.tooltips.requiresAccounts')
                          : t('dashboard.tooltips.requiresEntries')
                    : undefined,
            },
            {
                title: t('dashboard.generalLedger'),
                url: `/dashboard/${activeCompanyId}/general-ledger`,
                icon: BookOpenTextIcon,
                disabled: !permissions.canViewLedgers,
                tooltipContent: !permissions.canViewLedgers
                    ? !validationState.hasActiveCompany
                        ? t('dashboard.tooltips.requiresCompany')
                        : !validationState.hasAccounts
                          ? t('dashboard.tooltips.requiresAccounts')
                          : t('dashboard.tooltips.requiresEntries')
                    : undefined,
            },
        ],
        [activeCompanyId, permissions, validationState, t]
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
