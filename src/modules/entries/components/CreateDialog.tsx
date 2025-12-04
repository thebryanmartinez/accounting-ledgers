'use client';

import { useState } from 'react';



import { useTranslations } from 'next-intl';



import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';



import { getAllAccountsForHierarchy } from '@/modules/accounts/api';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { useActiveCompany } from '@/modules/companies/contexts';
import { SIDEBAR_QUERY_KEYS } from '@/modules/dashboard/constants';
import { createEntry } from '@/modules/entries/api';
import { EntryFormDialog, FormSchema } from '@/modules/entries/components/FormDialog';
import { ENTRIES_QUERY_KEYS } from '@/modules/entries/constants';
import { Button, Dialog, DialogTrigger } from '@/modules/shared/components';






















export const CreateEntryDialog = () => {
    const t = useTranslations('entries');
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const { activeCompanyId } = useActiveCompany();

    const { data: accounts = [] } = useQuery({
        queryKey: [ACCOUNTS_QUERY_KEYS.GET, activeCompanyId],
        queryFn: () => getAllAccountsForHierarchy(activeCompanyId),
        enabled: open && !!activeCompanyId,
    });

    const createEntryMutation = useMutation({
        mutationFn: createEntry,
        mutationKey: [ENTRIES_QUERY_KEYS.POST],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEYS.GET] });
            queryClient.invalidateQueries({
                queryKey: [SIDEBAR_QUERY_KEYS.VALIDATION, SIDEBAR_QUERY_KEYS.HAS_ENTRIES],
            });
            setOpen(false);
            toast.success(t('entryCreatedSuccess'));
        },
        onError: (error) => {
            toast.error(t('entryCreateError'), {
                description: error.message,
            });
        },
    });

    const onSubmit = async (values: FormSchema) => {
        await createEntryMutation.mutateAsync({
            company_id: activeCompanyId,
            account_id: values.account_id,
            memo: values.memo,
            debit: values.debit,
            credit: values.credit,
            date: values.date.toISOString(),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    {t('create')}
                </Button>
            </DialogTrigger>
            <EntryFormDialog
                title={t('createNewEntry')}
                description={t('createEntryDescription')}
                onSubmit={onSubmit}
                onSubmitMutation={createEntryMutation}
                defaultValues={{
                    account_id: '',
                    memo: '',
                    debit: 0,
                    credit: 0,
                    date: new Date(),
                }}
                actionButtonText={t('createEntry')}
                accounts={accounts}
            />
        </Dialog>
    );
};
