import { getTranslations } from 'next-intl/server';

import { AccountsTable, CreateAccountDialog } from '@/modules/accounts/components';
import { PageHeader } from '@/modules/shared/components';

export default async function AccountsPage() {
    const t = await getTranslations('accounts');

    return (
        <section className='space-y-6'>
            <PageHeader title={t('accountsTitle')} description={t('accountsDescription')}>
                <CreateAccountDialog />
            </PageHeader>
            <AccountsTable />
        </section>
    );
}
