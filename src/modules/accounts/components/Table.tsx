'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { useQuery } from '@tanstack/react-query';

import { getAllAccountsForHierarchy } from '@/modules/accounts/api';
import { AccountsEmptyState } from '@/modules/accounts/components/TableEmptyState';
import { AccountRowActions } from '@/modules/accounts/components/TableRowActions';
import { AccountsTableSkeleton } from '@/modules/accounts/components/TableSkeleton';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { AccountType } from '@/modules/accounts/models';
import { buildAccountHierarchy } from '@/modules/accounts/utils';
import { ACTIVE_COMPANY_ID_KEY } from '@/modules/companies/constants';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/modules/shared/components';
import {
    GARBAGE_COLLECTION_TIME_INTERVAL,
    REFETCH_ON_MOUNT_BOOLEAN,
    REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
    STALE_TIME_INTERVAL,
} from '@/modules/shared/constants';
import { useLocalStorage } from '@/modules/shared/hooks';

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

export const AccountsTable = () => {
    const t = useTranslations('accounts');
    const [activeCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');

    const { data: allAccounts = [], isPending } = useQuery({
        queryKey: [ACCOUNTS_QUERY_KEYS.GET, activeCompanyId],
        queryFn: () => getAllAccountsForHierarchy(activeCompanyId),
        enabled: !!activeCompanyId,
        staleTime: STALE_TIME_INTERVAL,
        gcTime: GARBAGE_COLLECTION_TIME_INTERVAL,
        refetchOnWindowFocus: REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
        refetchOnMount: REFETCH_ON_MOUNT_BOOLEAN,
    });

    const hierarchicalAccounts = useMemo(() => {
        return buildAccountHierarchy(allAccounts);
    }, [allAccounts]);

    // Helper function to check if an account has children
    const hasChildren = (accountId: string) => {
        return allAccounts.some((account) => account.parent_id === accountId);
    };

    if (isPending) {
        return <AccountsTableSkeleton />;
    }

    if (!allAccounts || allAccounts.length === 0) {
        return <AccountsEmptyState />;
    }

    return (
        <article className='space-y-4'>
            <Table>
                <TableHeader>
                    <TableRow className='[&> *]:font-bold'>
                        <TableHead className='w-[100px]'>{t('tableHeaderId')}</TableHead>
                        <TableHead>{t('tableHeaderName')}</TableHead>
                        <TableHead>{t('subtypeLabel')}</TableHead>
                        <TableHead className='text-right'>{t('tableHeaderDebit')}</TableHead>
                        <TableHead className='text-right'>{t('tableHeaderCredit')}</TableHead>
                        <TableHead className='w-[50px]'>{t('tableHeaderActions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {hierarchicalAccounts.map((account) => {
                        const isActive = account.type === AccountType.Active;
                        const isSubaccount = account.level === 1;

                        return (
                            <TableRow key={account.$id}>
                                <TableCell className='font-mono text-sm'>
                                    {isSubaccount && (
                                        <span className='inline-block mr-2 text-muted-foreground'>
                                            {account.isLastChild ? '└─' : '├─'}
                                        </span>
                                    )}
                                    {account.id}
                                </TableCell>
                                <TableCell className={`font-medium ${isSubaccount ? 'pl-8' : ''}`}>
                                    {account.name}
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            isActive
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                        }`}
                                    >
                                        {t(account.subtype)}
                                    </span>
                                </TableCell>
                                <TableCell className='text-right font-mono'>
                                    {formatCurrency(account.debit)}
                                </TableCell>
                                <TableCell className='text-right font-mono'>
                                    {formatCurrency(account.credit)}
                                </TableCell>
                                <TableCell>
                                    <AccountRowActions
                                        account={account}
                                        hasChildren={hasChildren(account.$id)}
                                    />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </article>
    );
};
