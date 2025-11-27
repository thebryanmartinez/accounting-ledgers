/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    ACCOUNT_CREATE_FORM_ID,
    ACCOUNT_IS_SUBACCOUNT_CHECKBOX_ID,
} from '@/modules/accounts/constants';
import { Account, AccountType } from '@/modules/accounts/models';
import {
    Button,
    Checkbox,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    Field,
    FieldError,
    FieldLabel,
    Input,
    Label,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/modules/shared/components';

interface AccountDialogForm {
    title: string;
    description: string;
    actionButtonText?: string;
    onSubmit: (values: FormSchema) => void;
    onSubmitMutation: any;
    defaultValues: AccountDialogDefaultValues;
    parentAccounts?: Account[];
}

interface AccountDialogDefaultValues {
    id: string;
    name: string;
    initial_value: number;
    type: AccountType;
    parent_id?: string;
}

export const createFormSchema = (t: (key: string) => string) => z.object({
    id: z.string().min(1, t('idRequired')).max(50, t('idMaxLength')),

    name: z.string().min(1, t('nameRequired')).max(100, t('nameMaxLength')),

    initial_value: z.coerce
        .number({
            error: t('initialValueRequired'),
        })
        .min(0, t('initialValueMin'))
        .refine(
            (val) => Number.isFinite(val) && Number(val.toFixed(2)) === val,
            t('initialValueDecimal')
        ),

    type: z.enum(AccountType, {
        error: t('typeRequired'),
    }),

    parent_id: z.string().optional(),
});

export type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

export const AccountFormDialog = ({
    title,
    description,
    actionButtonText,
    onSubmit,
    onSubmitMutation,
    defaultValues,
    parentAccounts = [],
}: AccountDialogForm) => {
    const t = useTranslations('accounts');
    const [isSubaccount, setIsSubaccount] = useState(!!defaultValues.parent_id);

    const formSchema = createFormSchema(t);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: defaultValues.id,
            name: defaultValues.name,
            initial_value: defaultValues.initial_value,
            type: defaultValues.type,
            parent_id: defaultValues.parent_id,
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
            <form id={ACCOUNT_CREATE_FORM_ID} onSubmit={handleSubmit} className='space-y-2'>
                <Controller
                    control={form.control}
                    name='id'
                    render={({ field, fieldState }) => {
                        const { ref, ...rest } = field;
                        return (
                            <Field>
                                <FieldLabel>{t('accountIdLabel')}</FieldLabel>
                                <Input placeholder='' {...rest} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        );
                    }}
                />
                <Controller
                    control={form.control}
                    name='name'
                    render={({ field, fieldState }) => {
                        const { ref, ...rest } = field;
                        return (
                            <Field>
                                <FieldLabel>{t('accountNameLabel')}</FieldLabel>
                                <Input placeholder='' {...rest} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        );
                    }}
                />
                <div className='flex w-full gap-4'>
                    <Controller
                        control={form.control}
                        name='initial_value'
                        render={({ field, fieldState }) => {
                            const { ref, ...rest } = field;
                            return (
                                <Field>
                                    <FieldLabel>{t('initialValueLabel')}</FieldLabel>
                                    <Input className='w-full' placeholder='' {...rest} />
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
                            const { ref, ...rest } = field;
                            return (
                                <Field className='w-full'>
                                    <FieldLabel>{t('typeLabel')}</FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
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
                </div>
                <div className='flex gap-2 py-2'>
                    <Checkbox
                        id={ACCOUNT_IS_SUBACCOUNT_CHECKBOX_ID}
                        checked={isSubaccount}
                        onCheckedChange={(checked) => setIsSubaccount(!!checked)}
                    />
                    <Label htmlFor={ACCOUNT_IS_SUBACCOUNT_CHECKBOX_ID}>
                        {t('isSubaccount')}
                    </Label>
                </div>
                {isSubaccount && (
                    <div>
                        <Controller
                            control={form.control}
                            name='parent_id'
                            render={({ field, fieldState }) => {
                                const { ref, ...rest } = field;
                                return (
                                    <Field className='w-full'>
                                        <FieldLabel>{t('parentAccountLabel')}</FieldLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder={t('selectParentPlaceholder')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {parentAccounts.length === 0 ? (
                                                    <div className='px-2 py-1.5 text-sm text-muted-foreground'>
                                                        {t('noParentAccountsAvailable')}
                                                    </div>
                                                ) : (
                                                    parentAccounts.map((account) => (
                                                        <SelectItem key={account.$id} value={account.id}>
                                                            {account.id} - {account.name}
                                                        </SelectItem>
                                                    ))
                                                )}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                );
                            }}
                        />
                    </div>
                )}
            </form>
            <Button
                form={ACCOUNT_CREATE_FORM_ID}
                type='submit'
                disabled={onSubmitMutation.isPending || !form.formState.isValid}
            >
                {onSubmitMutation.isPending && <Loader2 className='animate-spin' />}
                {actionButtonText}
            </Button>
        </DialogContent>
    );
};
