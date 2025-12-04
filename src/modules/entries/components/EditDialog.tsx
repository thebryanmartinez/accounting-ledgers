'use client';

import { useTranslations } from 'next-intl';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getAllAccountsForHierarchy } from '@/modules/accounts/api';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { useActiveCompany } from '@/modules/companies/contexts';
import { updateEntry } from '@/modules/entries/api';
import { EntryFormDialog, FormSchema } from '@/modules/entries/components/FormDialog';
import { ENTRIES_QUERY_KEYS } from '@/modules/entries/constants';
import { Entry } from '@/modules/entries/models';
import { Dialog, DialogContent } from '@/modules/shared/components';

interface EditEntryDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    entry: Entry;
}

export const EditEntryDialog = ({ isOpen, setIsOpen, entry }: EditEntryDialogProps) => {
    const t = useTranslations('entries');
    const queryClient = useQueryClient();
    const { activeCompanyId } = useActiveCompany();

    const { data: accounts = [] } = useQuery({
        queryKey: [ACCOUNTS_QUERY_KEYS.GET, activeCompanyId],
        queryFn: () => getAllAccountsForHierarchy(activeCompanyId),
        enabled: isOpen && !!activeCompanyId,
    });

    const updateEntryMutation = useMutation({
        mutationFn: (data: FormSchema) =>
            updateEntry(entry.$id, {
                account_id: data.account_id,
                memo: data.memo,
                debit: data.debit,
                credit: data.credit,
                date: data.date.toISOString(),
            }),
        mutationKey: [ENTRIES_QUERY_KEYS.UPDATE],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEYS.GET] });
            setIsOpen(false);
            toast.success(t('entryUpdatedSuccess'));
        },
        onError: (error) => {
            toast.error(t('entryUpdateError'), {
                description: error.message,
            });
        },
    });

    const onSubmit = async (values: FormSchema) => {
        await updateEntryMutation.mutateAsync(values);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <EntryFormDialog
                    title={t('editEntry')}
                    description={t('editEntryDescription')}
                    onSubmit={onSubmit}
                    onSubmitMutation={updateEntryMutation}
                    defaultValues={{
                        account_id: entry.account_id,
                        memo: entry.memo,
                        debit: entry.debit,
                        credit: entry.credit,
                        date: new Date(entry.date),
                    }}
                    actionButtonText={t('saveChanges')}
                    accounts={accounts}
                />
            </DialogContent>
        </Dialog>
    );
};