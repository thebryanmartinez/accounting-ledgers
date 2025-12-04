'use client';

import { useTranslations } from 'next-intl';

import { CreateLedgerDialog, LedgersList } from '@/modules/ledgers/components';
import { PageHeader } from '@/modules/shared/components';

export default function LedgersPage() {
    const t = useTranslations('ledgers');

    return (
        <section className='space-y-6 h-full flex flex-col'>
            <PageHeader title={t('ledgers')} description={t('ledgersDescription')}>
                <CreateLedgerDialog />
            </PageHeader>

            <article className='flex flex-1 flex-col'>
                <LedgersList />
            </article>
        </section>
    );
}
