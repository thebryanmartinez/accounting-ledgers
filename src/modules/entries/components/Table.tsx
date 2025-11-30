'use client';

import { useMemo } from 'react';

import { useTranslations } from 'next-intl';

import { useQuery } from '@tanstack/react-query';

import { getAllAccountsForHierarchy } from '@/modules/accounts/api';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { getEntriesByCompany } from '@/modules/entries/api';
import { EntriesEmptyState } from '@/modules/entries/components/TableEmptyState';
import { EntryRowActions } from '@/modules/entries/components/TableRowActions';
import { EntriesTableSkeleton } from '@/modules/entries/components/TableSkeleton';
import { ENTRIES_QUERY_KEYS } from '@/modules/entries/constants';
import { formatCurrency, formatDate, formatMonthLabel, groupEntriesByMonth } from '@/modules/entries/utils';
import { ACTIVE_COMPANY_ID_KEY } from '@/modules/companies/constants';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    useLocale,
} from '@/modules/shared/components';
import {
    GARBAGE_COLLECTION_TIME_INTERVAL,
    REFETCH_ON_MOUNT_BOOLEAN,
    REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
    STALE_TIME_INTERVAL,
} from '@/modules/shared/constants';
import { useLocalStorage } from '@/modules/shared/hooks';

export const EntriesTable = () => {
    const t = useTranslations('entries');
    const { locale } = useLocale();
    const [activeCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');

    const { data: allEntries = [], isPending: isEntriesPending } = useQuery({
        queryKey: [ENTRIES_QUERY_KEYS.GET, activeCompanyId],
        queryFn: () => getEntriesByCompany(activeCompanyId),
        enabled: !!activeCompanyId,
        staleTime: STALE_TIME_INTERVAL,
        gcTime: GARBAGE_COLLECTION_TIME_INTERVAL,
        refetchOnWindowFocus: REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
        refetchOnMount: REFETCH_ON_MOUNT_BOOLEAN,
    });

    const { data: accounts = [], isPending: isAccountsPending } = useQuery({
        queryKey: [ACCOUNTS_QUERY_KEYS.GET, activeCompanyId],
        queryFn: () => getAllAccountsForHierarchy(activeCompanyId),
        enabled: !!activeCompanyId,
        staleTime: STALE_TIME_INTERVAL,
        gcTime: GARBAGE_COLLECTION_TIME_INTERVAL,
        refetchOnWindowFocus: REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
        refetchOnMount: REFETCH_ON_MOUNT_BOOLEAN,
    });

    const accountsMap = useMemo(() => {
        const map = new Map();
        accounts.forEach((account) => {
            map.set(account.$id, account);
        });
        return map;
    }, [accounts]);

    const groupedEntries = useMemo(() => {
        return groupEntriesByMonth(allEntries);
    }, [allEntries]);

    if (isEntriesPending || isAccountsPending) {
        return <EntriesTableSkeleton />;
    }

    if (!allEntries || allEntries.length === 0) {
        return <EntriesEmptyState />;
    }

    return (
        <article className='space-y-8'>
            {groupedEntries.map((group) => (
                <section key={group.month} className='space-y-4'>
                    <h2 className='text-lg font-semibold'>{formatMonthLabel(group.month, locale)}</h2>
                    <Table>
                        <TableHeader>
                            <TableRow className='[&> *]:font-bold'>
                                <TableHead className='w-[100px]'>{t('tableHeaderDate')}</TableHead>
                                <TableHead>{t('tableHeaderAccount')}</TableHead>
                                <TableHead>{t('tableHeaderMemo')}</TableHead>
                                <TableHead className='text-right'>{t('tableHeaderDebit')}</TableHead>
                                <TableHead className='text-right'>{t('tableHeaderCredit')}</TableHead>
                                <TableHead className='w-[50px]'>{t('tableHeaderActions')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {group.entries.map((entry) => {
                                const hasDebit = entry.debit > 0;
                                const hasCredit = entry.credit > 0;

                                return (
                                    <TableRow key={entry.$id}>
                                        <TableCell className='font-mono text-sm'>
                                            {formatDate(entry.date, locale)}
                                        </TableCell>
                                        <TableCell className='font-medium'>
                                            {(() => {
                                                const account = accountsMap.get(entry.account_id);
                                                return account
                                                    ? `${account.id} - ${account.name}`
                                                    : entry.account_id;
                                            })()}
                                        </TableCell>
                                        <TableCell className='max-w-[300px] truncate'>
                                            {entry.memo}
                                        </TableCell>
                                        <TableCell className='text-right font-mono'>
                                            {hasDebit ? (
                                                <span className='text-green-600 dark:text-green-400'>
                                                    {formatCurrency(entry.debit)}
                                                </span>
                                            ) : (
                                                <span className='text-muted-foreground'>-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className='text-right font-mono'>
                                            {hasCredit ? (
                                                <span className='text-red-600 dark:text-red-400'>
                                                    {formatCurrency(entry.credit)}
                                                </span>
                                            ) : (
                                                <span className='text-muted-foreground'>-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <EntryRowActions entry={entry} />
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </section>
            ))}
        </article>
    );
};