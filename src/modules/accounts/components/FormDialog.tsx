/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import {
    ACCOUNT_CREATE_FORM_ID,
    ACCOUNT_IS_SUBACCOUNT_CHECKBOX_ID,
} from '@/modules/accounts/constants';
import { AccountType } from '@/modules/accounts/models';
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
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    onSubmitMutation: any;
    defaultValues: AccountDialogDefaultValues;
}

interface AccountDialogDefaultValues {
    id: string;
    name: string;
    initial_value: number;
    type: AccountType;
    parent_id?: string;
}

export const formSchema = z.object({
    id: z.string().min(1, 'ID is required').max(50, 'ID must be 50 characters or less'),

    name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),

    initial_value: z.coerce
        .number({
            error: 'Initial value is required',
        })
        .min(0, 'Initial value must be zero or greater')
        .refine(
            (val) => Number.isFinite(val) && Number(val.toFixed(2)) === val,
            'Initial value must have at most 2 decimal places'
        ),

    type: z.enum(AccountType, {
        error: 'Type is required',
    }),

    parent_id: z.string().optional(),
});

export const AccountFormDialog = ({
    title,
    description,
    actionButtonText,
    onSubmit,
    onSubmitMutation,
    defaultValues,
}: AccountDialogForm) => {
    const [isSubaccount, setIsSubaccount] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
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
                                <FieldLabel>Account ID</FieldLabel>
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
                                <FieldLabel>Account name</FieldLabel>
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
                                    <FieldLabel>Initial value</FieldLabel>
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
                                    <FieldLabel>Type</FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className='w-full'>
                                            <SelectValue placeholder='Select type of account' />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={AccountType.Active}>
                                                Active
                                            </SelectItem>
                                            <SelectItem value={AccountType.Passive}>
                                                Passive
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
                        Is this account a subaccount?
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
                                        <FieldLabel>Parent account</FieldLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder='Select parent account' />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={AccountType.Active}>
                                                    Active
                                                </SelectItem>
                                                <SelectItem value={AccountType.Passive}>
                                                    Passive
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
