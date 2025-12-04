import { getTranslations } from 'next-intl/server';

import { CompanyIdSync, PageHeader } from '@/modules/shared/components';
import { CompanyIdPageProps } from '@/modules/shared/models';

export default async function AccountsPage({ params }: CompanyIdPageProps) {
    const t = await getTranslations('accounts');

    return (
        <section className='space-y-6'>
            <CompanyIdSync companyId={params.companyId} />
            <PageHeader title={t('accountsTitle')} description={t('accountsDescription')}>
                <button>Hello</button>
            </PageHeader>
        </section>
    );
}
