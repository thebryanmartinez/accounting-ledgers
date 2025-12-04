import { getTranslations } from 'next-intl/server';

import { CreateEntryDialog, EntriesTable } from '@/modules/entries/components';
import { CompanyIdSync, PageHeader } from '@/modules/shared/components';
import { CompanyIdPageProps } from '@/modules/shared/models';

export default async function EntriesPage({ params }: CompanyIdPageProps) {
    const t = await getTranslations('entries');

    return (
        <section className='space-y-6 h-full flex flex-col'>
            <CompanyIdSync companyId={params.companyId} />
            <PageHeader title={t('entriesTitle')} description={t('entriesDescription')}>
                <CreateEntryDialog />
            </PageHeader>
            <article className='flex flex-1 flex-col'>
                <EntriesTable />
            </article>
        </section>
    );
}
