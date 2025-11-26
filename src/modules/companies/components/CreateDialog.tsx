'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { z } from 'zod';

import { account } from '@/lib/appwrite';
import { createCompany } from '@/modules/companies/api';
import { CompanyDialogForm, formSchema } from '@/modules/companies/components';
import { COMPANIES_QUERY_KEYS } from '@/modules/companies/constants';
import { Button, Dialog, DialogTrigger } from '@/modules/shared/components';

export const CreateCompanyDialog = () => {
    const t = useTranslations('companies');
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const createCompanyMutation = useMutation({
        mutationFn: createCompany,
        mutationKey: [COMPANIES_QUERY_KEYS.POST],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEYS.GET] });
            setOpen(false);
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const user = await account.get();
        await createCompanyMutation.mutateAsync({
            user_id: user.$id,
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
            <CompanyDialogForm
                title={t('createNewCompany')}
                description={t('createCompanyDescription')}
                onSubmit={onSubmit}
                onSubmitMutation={createCompanyMutation}
            />
        </Dialog>
    );
};
