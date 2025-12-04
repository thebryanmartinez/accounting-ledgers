'use client';

import { useQuery } from '@tanstack/react-query';

import { useActiveCompany } from '@/modules/companies/contexts';
import { getLedgers } from '@/modules/ledgers/api';
import { LedgerCard } from '@/modules/ledgers/components/LedgerCard';
import { LedgersEmptyState } from '@/modules/ledgers/components/LedgersEmptyState';
import { LedgersSkeleton } from '@/modules/ledgers/components/LedgersSkeleton';
import { LEDGERS_QUERY_KEYS } from '@/modules/ledgers/constants';
import { LedgerTable } from '@/modules/ledgers/models';
import {
    GARBAGE_COLLECTION_TIME_INTERVAL,
    REFETCH_ON_MOUNT_BOOLEAN,
    REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
    STALE_TIME_INTERVAL,
} from '@/modules/shared/constants';

export const LedgersList = () => {
    const { activeCompanyId } = useActiveCompany();

    const { data: ledgers = [], isPending } = useQuery({
        queryKey: [LEDGERS_QUERY_KEYS.GET, activeCompanyId],
        queryFn: () => getLedgers(activeCompanyId),
        enabled: !!activeCompanyId,
        staleTime: STALE_TIME_INTERVAL,
        gcTime: GARBAGE_COLLECTION_TIME_INTERVAL,
        refetchOnWindowFocus: REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
        refetchOnMount: REFETCH_ON_MOUNT_BOOLEAN,
    });

    if (isPending) {
        return <LedgersSkeleton />;
    }

    if (!ledgers || ledgers.length === 0) {
        return <LedgersEmptyState />;
    }

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6'>
            {ledgers.map((ledger: LedgerTable) => (
                <LedgerCard
                    key={ledger.$id}
                    accountId={ledger.account_id}
                    name={ledger.name}
                    currentBalance={ledger.current_balance}
                    totalDebits={ledger.total_debits}
                    totalCredits={ledger.total_credits}
                    createdAt={new Date(ledger.$createdAt)}
                />
            ))}
        </div>
    );
};
