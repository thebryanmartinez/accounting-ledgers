/* eslint-disable @typescript-eslint/no-unused-vars */
import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { deleteCompany } from '@/modules/companies/api';
import { useActiveCompany } from '@/modules/companies/contexts';
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
import { FieldError, FieldLabel, Input } from '@/modules/shared/components';

import { COMPANIES_QUERY_KEYS } from '../constants';

interface CompanyDeleteDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    deleteMutationCallback: () => void;
    id: string;
    companyName: string;
}

export const CompanyDeleteDialog = ({
    isOpen,
    setIsOpen,
    deleteMutationCallback,
    id,
    companyName,
}: CompanyDeleteDialogProps) => {
    const t = useTranslations('companies');
    const ts = useTranslations('shared');
    const queryClient = useQueryClient();
    const { clearActiveCompany } = useActiveCompany();

    const formSchema = z.object({
        confirmation: z.string().refine((value) => value === companyName, {
            message: t('deleteCompanyNameMismatch'),
        }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            confirmation: '',
        },
    });

    const deleteCompanyMutation = useMutation({
        mutationFn: deleteCompany,
        mutationKey: [COMPANIES_QUERY_KEYS.DELETE],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEYS.GET] });
            deleteMutationCallback();
        },
    });

    const handleDelete = () => {
        deleteCompanyMutation.mutateAsync(id);
        clearActiveCompany();
    };

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t('deleteCompany')}: {companyName}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('deleteCompanyConfirmation')}
                    </AlertDialogDescription>
                    <div className='mt-3 flex items-start gap-2 rounded-md bg-red-50 p-3 text-red-900 dark:bg-red-950/20 dark:text-red-200'>
                        <AlertTriangle className='h-5 w-5 shrink-0 mt-0.5' />
                        <p className='text-sm'>{t('deleteCompanyWarning')}</p>
                    </div>
                </AlertDialogHeader>
                <div className='py-4'>
                    <FieldLabel>{t('deleteCompanyConfirmationInput')}</FieldLabel>
                    <Controller
                        control={form.control}
                        name='confirmation'
                        render={({ field, fieldState }) => {
                            const { ref, ...rest } = field;
                            return (
                                <>
                                    <Input placeholder={companyName} {...rest} className='mt-1' />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className='mt-1' />
                                    )}
                                </>
                            );
                        }}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={deleteCompanyMutation.isPending}>
                        {ts('cancel')}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleteCompanyMutation.isPending || !form.formState.isValid}
                        className='bg-destructive text-white hover:bg-destructive/90'
                    >
                        {deleteCompanyMutation.isPending && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        {ts('confirm')}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
