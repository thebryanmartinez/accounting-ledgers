'use client';

import { useTranslations } from 'next-intl';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { deleteAccount } from '@/modules/accounts/api';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/modules/shared/components';

interface DeleteAccountDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    accountId: string;
    accountName: string;
    hasChildren?: boolean;
}

export const DeleteAccountDialog = ({
    isOpen,
    setIsOpen,
    accountId,
    accountName,
    hasChildren = false,
}: DeleteAccountDialogProps) => {
    const t = useTranslations('accounts');
    const ts = useTranslations('shared');
    const queryClient = useQueryClient();

    const deleteAccountMutation = useMutation({
        mutationFn: deleteAccount,
        mutationKey: [ACCOUNTS_QUERY_KEYS.DELETE],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEYS.GET] });
            setIsOpen(false);
            toast.success(t('accountDeletedSuccess'));
        },
        onError: (error) => {
            toast.error(t('accountDeleteError'), {
                description: error.message,
            });
        },
    });

    const handleDelete = () => {
        deleteAccountMutation.mutateAsync(accountId);
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteAccount')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('deleteAccountConfirmation', { name: accountName })}
                    </AlertDialogDescription>
                    {hasChildren && (
                        <div className='mt-3 flex items-start gap-2 rounded-md bg-amber-50 p-3 text-amber-900 dark:bg-amber-950/20 dark:text-amber-200'>
                            <AlertTriangle className='h-5 w-5 flex-shrink-0 mt-0.5' />
                            <p className='text-sm'>{t('deleteAccountWillDeleteChildren')}</p>
                        </div>
                    )}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteAccountMutation.isPending}>
                        {ts('cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteAccountMutation.isPending}
                        className='bg-destructive text-white hover:bg-destructive/90'
                    >
                        {deleteAccountMutation.isPending && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        {ts('confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
