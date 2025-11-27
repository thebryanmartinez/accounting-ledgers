'use client';

import { useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import { useQuery } from '@tanstack/react-query';

import { getAllAccountsForHierarchy } from '@/modules/accounts/api';
import { AccountsEmptyState } from '@/modules/accounts/components/TableEmptyState';
import { AccountRowActions } from '@/modules/accounts/components/TableRowActions';
import { AccountsTableSkeleton } from '@/modules/accounts/components/TableSkeleton';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { AccountType } from '@/modules/accounts/models';
import {
    buildAccountHierarchy,
    paginateHierarchicalAccounts,
} from '@/modules/accounts/utils/hierarchy.utils';
import { ACTIVE_COMPANY_ID_KEY } from '@/modules/companies/constants';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/modules/shared/components';
import { useLocalStorage } from '@/modules/shared/hooks';

const ITEMS_PER_PAGE = 10;

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

export const AccountsTable = () => {
    const t = useTranslations('accounts');
    const tp = useTranslations('pagination');
    const [page, setPage] = useState(1);
    const [activeCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');

    const { data: allAccounts = [], isPending } = useQuery({
        queryKey: [ACCOUNTS_QUERY_KEYS.GET, activeCompanyId],
        queryFn: () => getAllAccountsForHierarchy(activeCompanyId),
        enabled: !!activeCompanyId,
    });

    const { paginatedAccounts, totalGroups } = useMemo(() => {
        const hierarchical = buildAccountHierarchy(allAccounts);
        const { paginatedAccounts, totalGroups } = paginateHierarchicalAccounts(
            hierarchical,
            page,
            ITEMS_PER_PAGE
        );

        return {
            hierarchicalAccounts: hierarchical,
            paginatedAccounts,
            totalGroups,
        };
    }, [allAccounts, page]);

    // Helper function to check if an account has children
    const hasChildren = (accountId: string) => {
        return allAccounts.some((account) => account.parent_id === accountId);
    };

    // Only show pagination if we have more groups than can fit on one page
    const shouldShowPagination = totalGroups > ITEMS_PER_PAGE && false;
    const totalPages = shouldShowPagination ? Math.ceil(totalGroups / ITEMS_PER_PAGE) : 1;
    const startItem = Math.min((page - 1) * ITEMS_PER_PAGE + 1, totalGroups);
    const endItem = Math.min(page * ITEMS_PER_PAGE, totalGroups);

    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (page > 3) {
                pages.push('ellipsis');
            }

            const start = Math.max(2, page - 1);
            const end = Math.min(totalPages - 1, page + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) {
                pages.push('ellipsis');
            }

            pages.push(totalPages);
        }

        return pages;
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
                    <TableRow className='[&>*]:font-bold'>
                        <TableHead className='w-[100px]'>{t('tableHeaderId')}</TableHead>
                        <TableHead>{t('tableHeaderName')}</TableHead>
                        <TableHead>{t('tableHeaderType')}</TableHead>
                        <TableHead className='text-right'>{t('tableHeaderBalance')}</TableHead>
                        <TableHead className='w-[50px]'>{t('tableHeaderActions')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedAccounts.map((account) => {
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
                                        {isActive ? t('active') : t('passive')}
                                    </span>
                                </TableCell>
                                <TableCell className='text-right font-mono'>
                                    {formatCurrency(account.initial_value)}
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

            {shouldShowPagination && (
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <p className='text-sm text-muted-foreground'>
                        {tp('showing')} {startItem} {tp('to')} {endItem} {tp('of')} {totalGroups}{' '}
                        {tp('results')}
                    </p>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    aria-disabled={page === 1}
                                    className={page === 1 ? 'pointer-events-none opacity-50' : ''}
                                />
                            </PaginationItem>

                            {getPageNumbers().map((pageNum, index) =>
                                pageNum === 'ellipsis' ? (
                                    <PaginationItem key={`ellipsis-${index}`}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink
                                            onClick={() => setPage(pageNum)}
                                            isActive={page === pageNum}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                )
                            )}

                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    aria-disabled={page === totalPages}
                                    className={
                                        page === totalPages ? 'pointer-events-none opacity-50' : ''
                                    }
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </article>
    );
};
