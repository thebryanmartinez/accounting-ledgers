'use client';

import { useTranslations } from 'next-intl';

import { PageHeader } from '@/modules/shared/components';

export default function LedgersPage() {
    const t = useTranslations('ledgers');

    return (
        <section className='space-y-6'>
            <PageHeader title={t('ledgers')} description={t('ledgersDescription')}>
                {/* Add actions or content here */}
            </PageHeader>

            <div className='flex h-full col-span-full w-full flex-col items-center justify-center'></div>
        </section>
    );
}
