'use client';

import { useTranslations } from 'next-intl';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { SIDEBAR_QUERY_KEYS } from '@/modules/dashboard/constants';
import { deleteEntry } from '@/modules/entries/api';
import { ENTRIES_QUERY_KEYS } from '@/modules/entries/constants';
import { Entry } from '@/modules/entries/models';
import { formatCurrency, formatDate } from '@/modules/entries/utils';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    useLocale,
} from '@/modules/shared/components';

interface DeleteEntryDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    entry: Entry;
}

export const DeleteEntryDialog = ({ isOpen, setIsOpen, entry }: DeleteEntryDialogProps) => {
    const t = useTranslations('entries');
    const ts = useTranslations('shared');
    const { locale } = useLocale();
    const queryClient = useQueryClient();

    const deleteEntryMutation = useMutation({
        mutationFn: deleteEntry,
        mutationKey: [ENTRIES_QUERY_KEYS.DELETE],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENTRIES_QUERY_KEYS.GET, SIDEBAR_QUERY_KEYS.VALIDATION, SIDEBAR_QUERY_KEYS.HAS_ENTRIES] });
            setIsOpen(false);
            toast.success(t('entryDeletedSuccess'));
        },
        onError: (error) => {
            toast.error(t('entryDeleteError'), {
                description: error.message,
            });
        },
    });

    const handleDelete = () => {
        deleteEntryMutation.mutateAsync(entry.$id);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteEntry')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('deleteEntryConfirmation')}
                    </AlertDialogDescription>
                    <div className='mt-3 rounded-md border bg-muted/50 p-3'>
                        <dl className='space-y-2 text-sm'>
                            <div className='flex justify-between'>
                                <dt className='text-muted-foreground'>{t('dateLabel')}:</dt>
                                <dd className='font-medium'>{formatDate(entry.date, locale)}</dd>
                            </div>
                            <div className='flex justify-between'>
                                <dt className='text-muted-foreground'>{t('memoLabel')}:</dt>
                                <dd className='font-medium'>{entry.memo}</dd>
                            </div>
                            {entry.debit > 0 && (
                                <div className='flex justify-between'>
                                    <dt className='text-muted-foreground'>{t('debitLabel')}:</dt>
                                    <dd className='font-medium text-green-600 dark:text-green-400'>
                                        {formatCurrency(entry.debit)}
                                    </dd>
                                </div>
                            )}
                            {entry.credit > 0 && (
                                <div className='flex justify-between'>
                                    <dt className='text-muted-foreground'>{t('creditLabel')}:</dt>
                                    <dd className='font-medium text-red-600 dark:text-red-400'>
                                        {formatCurrency(entry.credit)}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteEntryMutation.isPending}>
                        {ts('cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteEntryMutation.isPending}
                        className='bg-destructive text-white hover:bg-destructive/90'
                    >
                        {deleteEntryMutation.isPending && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        {ts('confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};