import { getTranslations } from 'next-intl/server';

import { AccountsTable, CreateAccountDialog } from '@/modules/accounts/components';
import { CompanyIdSync, PageHeader } from '@/modules/shared/components';
import { CompanyIdPageProps } from '@/modules/shared/models';

export default async function AccountsPage({ params }: CompanyIdPageProps) {
    const t = await getTranslations('accounts');

    return (
        <section className='space-y-6 h-full flex flex-col '>
            <CompanyIdSync companyId={params.companyId} />
            <PageHeader title={t('accountsTitle')} description={t('accountsDescription')}>
                <CreateAccountDialog />
            </PageHeader>
            <article className='flex flex-1 flex-col'>
                <AccountsTable />
            </article>
        </section>
    );
}
