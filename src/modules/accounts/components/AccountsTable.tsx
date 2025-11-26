'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { useQuery } from '@tanstack/react-query';

import { getAccountsPaginated } from '@/modules/accounts/api';
import { AccountRowActions } from '@/modules/accounts/components/AccountRowActions';
import { AccountsEmptyState } from '@/modules/accounts/components/AccountsEmptyState';
import { AccountsTableSkeleton } from '@/modules/accounts/components/AccountsTableSkeleton';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { AccountType } from '@/modules/accounts/models';
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

    const { data, isLoading } = useQuery({
        queryKey: [ACCOUNTS_QUERY_KEYS.GET, activeCompanyId, page],
        queryFn: () =>
            getAccountsPaginated({
                company_id: activeCompanyId,
                limit: ITEMS_PER_PAGE,
                offset: (page - 1) * ITEMS_PER_PAGE,
            }),
        enabled: !!activeCompanyId,
    });

    const totalPages = Math.ceil((data?.total ?? 0) / ITEMS_PER_PAGE);
    const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
    const endItem = Math.min(page * ITEMS_PER_PAGE, data?.total ?? 0);

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

    if (isLoading) {
        return <AccountsTableSkeleton />;
    }

    if (!data?.rows || data.rows.length === 0) {
        return <AccountsEmptyState />;
    }

    return (
        <div className='space-y-4'>
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
                    {data.rows.map((account) => {
                        const isActive = account.type === AccountType.Active;
                        return (
                            <TableRow key={account.$id}>
                                <TableCell className='font-mono text-sm'>{account.id}</TableCell>
                                <TableCell className='font-medium'>{account.name}</TableCell>
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
                                    <AccountRowActions account={account} />
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>

            {totalPages > 1 && (
                <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <p className='text-sm text-muted-foreground'>
                        {tp('showing')} {startItem} {tp('to')} {endItem} {tp('of')} {data.total}{' '}
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
        </div>
    );
};
