'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { createAccount, getParentAccounts } from '@/modules/accounts/api';
import { AccountFormDialog, FormSchema } from '@/modules/accounts/components';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { AccountType } from '@/modules/accounts/models';
import { ACTIVE_COMPANY_ID_KEY } from '@/modules/companies/constants';
import { Button, Dialog, DialogTrigger } from '@/modules/shared/components';
import { useLocalStorage } from '@/modules/shared/hooks';

export const CreateAccountDialog = () => {
    const t = useTranslations('accounts');
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [activeCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');

    const { data: parentAccounts = [] } = useQuery({
        queryKey: [ACCOUNTS_QUERY_KEYS.GET, 'parents', activeCompanyId],
        queryFn: () => getParentAccounts(activeCompanyId),
        enabled: open && !!activeCompanyId,
    });

    const createAccountMutation = useMutation({
        mutationFn: createAccount,
        mutationKey: [ACCOUNTS_QUERY_KEYS.POST],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEYS.GET] });
            setOpen(false);
            toast.success(t('accountCreatedSuccess'));
        },
        onError: (error) => {
            toast.error(t('accountCreateError'), {
                description: error.message,
            });
        },
    });

    const onSubmit = async (values: FormSchema) => {
        await createAccountMutation.mutateAsync({
            company_id: activeCompanyId,
            ...values,
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
            <AccountFormDialog
                title={t('createNewAccount')}
                description={t('createAccountDescription')}
                onSubmit={onSubmit}
                onSubmitMutation={createAccountMutation}
                defaultValues={{
                    name: '',
                    id: '',
                    initial_value: 0,
                    type: AccountType.Active,
                }}
                actionButtonText={t('createAccount')}
                parentAccounts={parentAccounts}
            />
        </Dialog>
    );
};
