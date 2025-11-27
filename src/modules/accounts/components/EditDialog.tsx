'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { updateAccount } from '@/modules/accounts/api';
import { ACCOUNTS_QUERY_KEYS } from '@/modules/accounts/constants';
import { Account, AccountType } from '@/modules/accounts/models';
import {
    Button,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Field,
    FieldError,
    FieldLabel,
    Input,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/modules/shared/components';

interface EditAccountDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    account: Account;
}

const createFormSchema = (t: (key: string) => string) =>
    z.object({
        name: z.string().min(1, t('nameRequired')).max(100, t('nameMaxLength')),
        type: z.enum(AccountType, {
            error: () => ({ message: t('typeRequired') }),
        }),
    });

type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

export const EditAccountDialog = ({ isOpen, setIsOpen, account }: EditAccountDialogProps) => {
    const t = useTranslations('accounts');
    const ts = useTranslations('shared');
    const queryClient = useQueryClient();

    const formSchema = createFormSchema(t);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: account.name,
            type: account.type,
        },
    });

    const updateAccountMutation = useMutation({
        mutationFn: (data: FormSchema) => updateAccount(account.$id, data),
        mutationKey: [ACCOUNTS_QUERY_KEYS.UPDATE],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEYS.GET] });
            setIsOpen(false);
            toast.success(t('accountUpdatedSuccess'));
        },
        onError: (error) => {
            toast.error(t('accountUpdateError'), {
                description: error.message,
            });
        },
    });

    const handleSubmit = form.handleSubmit(async (values) => {
        await updateAccountMutation.mutateAsync(values);
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('editAccount')}</DialogTitle>
                    <DialogDescription>{t('editAccountDescription')}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                    <Field>
                        <FieldLabel>{t('accountIdLabel')}</FieldLabel>
                        <Input value={account.id} disabled className='bg-muted' />
                        <p className='text-xs text-muted-foreground'>{t('idCannotBeChanged')}</p>
                    </Field>
                    {account.parent_id && (
                        <Field>
                            <FieldLabel>{t('parentAccountLabel')}</FieldLabel>
                            <Input value={account.parent_id} disabled className='bg-muted' />
                            <p className='text-xs text-muted-foreground'>{t('parentIdCannotBeChanged')}</p>
                        </Field>
                    )}
                    <Controller
                        control={form.control}
                        name='name'
                        render={({ field, fieldState }) => {
                            const { ref, ...rest } = field;
                            return (
                                <Field>
                                    <FieldLabel>{t('accountNameLabel')}</FieldLabel>
                                    <Input placeholder='' {...rest} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            );
                        }}
                    />
                    <Controller
                        control={form.control}
                        name='type'
                        render={({ field, fieldState }) => {
                            return (
                                <Field className='w-full'>
                                    <FieldLabel>{t('typeLabel')}</FieldLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder={t('selectTypePlaceholder')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={AccountType.Active}>
                                                {t('active')}
                                            </SelectItem>
                                            <SelectItem value={AccountType.Passive}>
                                                {t('passive')}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            );
                        }}
                    />
                </form>
                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => setIsOpen(false)}
                        disabled={updateAccountMutation.isPending}
                    >
                        {ts('cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={updateAccountMutation.isPending || !form.formState.isValid}
                    >
                        {updateAccountMutation.isPending && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        {t('saveChanges')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
