import { AccountHeader, AccountsTable, CreateAccountDialog } from '@/modules/accounts/components';
import { SlugPagesProps } from '@/modules/shared/models';

export default async function AccountsPage({ params }: SlugPagesProps) {
    return (
        <section className='space-y-6'>
            <div className='flex items-center justify-between'>
                <AccountHeader />
                <CreateAccountDialog />
            </div>
            <AccountsTable />
        </section>
    );
}
