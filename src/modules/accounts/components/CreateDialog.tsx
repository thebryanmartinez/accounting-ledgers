'use client';

import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';

import { createAccount } from '@/modules/accounts/api';
import { AccountFormDialog, formSchema } from '@/modules/accounts/components';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { AccountType } from '@/modules/accounts/models';
import { ACTIVE_COMPANY_ID_KEY } from '@/modules/companies/constants';
import { Button, Dialog, DialogTrigger } from '@/modules/shared/components';
import { useLocalStorage } from '@/modules/shared/hooks';

export const CreateAccountDialog = () => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const [activeCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');

    const createAccountMutation = useMutation({
        mutationFn: createAccount,
        mutationKey: [ACCOUNTS_QUERY_KEYS.POST],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEYS.GET] });
            setOpen(false);
            toast.success('Account has been created successfully');
        },
        onError: (error) => {
            toast.error('There was an error creating the account', {
                description: error.message,
            });
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await createAccountMutation.mutateAsync({
            company_id: activeCompanyId,
            ...values,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>
                    <Plus />
                    Create
                </Button>
            </DialogTrigger>
            <AccountFormDialog
                title='Create a new account'
                description='Accounts will help diaries be more organized'
                onSubmit={onSubmit}
                onSubmitMutation={createAccountMutation}
                defaultValues={{
                    name: '',
                    id: '',
                    initial_value: 0,
                    type: AccountType.Active,
                }}
                actionButtonText='Create account'
            />
        </Dialog>
    );
};
