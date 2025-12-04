/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { ENTRY_CREATE_FORM_ID } from '@/modules/entries/constants';
import { Account } from '@/modules/accounts/models';
import {
    Button,
    DatePicker,
    DialogContent,
    DialogDescription,
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

interface EntryDialogForm {
    title: string;
    description: string;
    actionButtonText?: string;
    onSubmit: (values: FormSchema) => void;
    onSubmitMutation: any;
    defaultValues: EntryDialogDefaultValues;
    accounts: Account[];
}

interface EntryDialogDefaultValues {
    account_id: string;
    memo: string;
    debit: number;
    credit: number;
    date: Date;
}

export const createFormSchema = (t: (key: string) => string) =>
    z
        .object({
            account_id: z.string().min(1, t('accountRequired')),
            memo: z.string().min(1, t('memoRequired')).max(128, t('memoMaxLength')),
            debit: z.coerce.number().min(0, t('debitMustBePositive')),
            credit: z.coerce.number().min(0, t('creditMustBePositive')),
            date: z.date({
                error: t('dateRequired'),
            }),
        })
        .refine(
            (data) => {
                // Either debit OR credit must be greater than 0, but not both
                const hasDebit = data.debit > 0;
                const hasCredit = data.credit > 0;
                return (hasDebit && !hasCredit) || (!hasDebit && hasCredit);
            },
            {
                message: t('debitOrCreditRequired'),
                path: ['debit'],
            }
        );

export type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

export const EntryFormDialog = ({
    title,
    description,
    actionButtonText,
    onSubmit,
    onSubmitMutation,
    defaultValues,
    accounts,
}: EntryDialogForm) => {
    const t = useTranslations('entries');

    const formSchema = createFormSchema(t);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            account_id: defaultValues.account_id,
            memo: defaultValues.memo,
            debit: defaultValues.debit,
            credit: defaultValues.credit,
            date: defaultValues.date,
        },
    });

    const handleSubmit = form.handleSubmit(async (values) => {
        await onSubmit(values);
        form.reset();
    });

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>{description}</DialogDescription>
            </DialogHeader>
            <form id={ENTRY_CREATE_FORM_ID} onSubmit={handleSubmit} className='space-y-4'>
                <Controller
                    control={form.control}
                    name='account_id'
                    render={({ field, fieldState }) => {
                        return (
                            <Field className='w-full'>
                                <FieldLabel>{t('accountLabel')}</FieldLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder={t('selectAccountPlaceholder')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {accounts.length === 0 ? (
                                            <div className='px-2 py-1.5 text-sm text-muted-foreground'>
                                                {t('noAccountsAvailable')}
                                            </div>
                                        ) : (
                                            accounts.map((account) => (
                                                <SelectItem key={account.$id} value={account.$id}>
                                                    {account.id} - {account.name}
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        );
                    }}
                />

                <Controller
                    control={form.control}
                    name='date'
                    render={({ field, fieldState }) => {
                        return (
                            <Field>
                                <FieldLabel>{t('dateLabel')}</FieldLabel>
                                <DatePicker
                                    date={field.value}
                                    onSelect={field.onChange}
                                    placeholder={t('selectDatePlaceholder')}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        );
                    }}
                />

                <Controller
                    control={form.control}
                    name='memo'
                    render={({ field, fieldState }) => {
                        const { ref, ...rest } = field;
                        return (
                            <Field>
                                <FieldLabel>{t('memoLabel')}</FieldLabel>
                                <Input placeholder={t('memoPlaceholder')} {...rest} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        );
                    }}
                />

                <div className='flex w-full gap-4'>
                    <Controller
                        control={form.control}
                        name='debit'
                        render={({ field, fieldState }) => {
                            const { ref, ...rest } = field;
                            return (
                                <Field className='w-full'>
                                    <FieldLabel>{t('debitLabel')}</FieldLabel>
                                    <Input
                                        type='number'
                                        step='0.01'
                                        min='0'
                                        placeholder='0.00'
                                        {...rest}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            );
                        }}
                    />

                    <Controller
                        control={form.control}
                        name='credit'
                        render={({ field, fieldState }) => {
                            const { ref, ...rest } = field;
                            return (
                                <Field className='w-full'>
                                    <FieldLabel>{t('creditLabel')}</FieldLabel>
                                    <Input
                                        type='number'
                                        step='0.01'
                                        min='0'
                                        placeholder='0.00'
                                        {...rest}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            );
                        }}
                    />
                </div>
            </form>
            <Button
                form={ENTRY_CREATE_FORM_ID}
                type='submit'
                disabled={onSubmitMutation.isPending || !form.formState.isValid}
            >
                {onSubmitMutation.isPending && <Loader2 className='animate-spin' />}
                {actionButtonText}
            </Button>
        </DialogContent>
    );
};