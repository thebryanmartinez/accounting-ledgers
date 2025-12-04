'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

import { useActiveCompany } from '@/modules/companies/contexts';
import { createLedger } from '@/modules/ledgers/api';
import { LEDGERS_QUERY_KEYS } from '@/modules/ledgers/constants';
import { Button, Dialog, DialogTrigger } from '@/modules/shared/components';

export const CreateLedgerDialog = () => {
    const t = useTranslations('ledgers');
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    const { activeCompanyId } = useActiveCompany();

    const createLedgerMutation = useMutation({
        mutationFn: createLedger,
        mutationKey: [LEDGERS_QUERY_KEYS.POST],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [LEDGERS_QUERY_KEYS.GET] });
            setOpen(false);
            toast.success(t('ledgerCreatedSuccess'));
        },
        onError: (error) => {
            toast.error(t('ledgerCreateError'), {
                description: error.message,
            });
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus />
                    {t('create')}
                </Button>
            </DialogTrigger>
            {/* FormDialog component will be added later */}
        </Dialog>
    );
};
