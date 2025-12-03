'use client';

import { useQuery } from '@tanstack/react-query';

import { hasAccounts } from '@/modules/accounts/api';
import { useActiveCompany } from '@/modules/companies/contexts';
import { SIDEBAR_QUERY_KEYS } from '@/modules/dashboard/constants';
import { SidebarPermissions, ValidationState } from '@/modules/dashboard/models/sidebar.model';
import { hasEntries } from '@/modules/entries/api';
import {
    SIDEBAR_CHECK_GARBAGE_COLLECTION_TIME_INTERVAL,
    SIDEBAR_CHECK_STALE_TIME_INTERVAL,
} from '@/modules/shared/constants';

export const useSidebarValidation = () => {
    const { activeCompanyId } = useActiveCompany();

    // Check if accounts exist
    const { data: accountsExist = false, isLoading: accountsLoading } = useQuery({
        queryKey: [SIDEBAR_QUERY_KEYS.VALIDATION, SIDEBAR_QUERY_KEYS.HAS_ACCOUNTS, activeCompanyId],
        queryFn: () => hasAccounts(activeCompanyId),
        enabled: !!activeCompanyId,
        staleTime: SIDEBAR_CHECK_STALE_TIME_INTERVAL,
        gcTime: SIDEBAR_CHECK_GARBAGE_COLLECTION_TIME_INTERVAL,
    });

    // Check if entries exist
    const { data: entriesExist = false, isLoading: entriesLoading } = useQuery({
        queryKey: [SIDEBAR_QUERY_KEYS.VALIDATION, SIDEBAR_QUERY_KEYS.HAS_ENTRIES, activeCompanyId],
        queryFn: () => hasEntries(activeCompanyId),
        enabled: !!activeCompanyId && accountsExist,
        staleTime: SIDEBAR_CHECK_STALE_TIME_INTERVAL,
        gcTime: SIDEBAR_CHECK_GARBAGE_COLLECTION_TIME_INTERVAL,
    });

    const validationState: ValidationState = {
        hasActiveCompany: !!activeCompanyId,
        hasAccounts: accountsExist,
        hasEntries: entriesExist,
        isLoading: accountsLoading || entriesLoading,
    };

    const permissions: SidebarPermissions = {
        canViewAccounts: validationState.hasActiveCompany,
        canViewDiaries: validationState.hasActiveCompany && validationState.hasAccounts,
        canViewEntries: validationState.hasActiveCompany && validationState.hasAccounts,
        canViewLedgers:
            validationState.hasActiveCompany &&
            validationState.hasAccounts &&
            validationState.hasEntries,
    };

    return {
        validationState,
        permissions,
    };
};
