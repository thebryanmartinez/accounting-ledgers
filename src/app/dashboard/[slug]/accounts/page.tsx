import { CreateAccountDialog } from '@/modules/accounts/components';
import { SlugPagesProps } from '@/modules/shared/models';

export default async function AccountsPage({ params }: SlugPagesProps) {
    return (
        <section>
            <CreateAccountDialog />
        </section>
    );
}
