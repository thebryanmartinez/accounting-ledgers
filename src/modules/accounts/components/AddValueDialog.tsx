'use client';

import { useTranslations } from 'next-intl';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { updateAccountValue } from '@/modules/accounts/api';
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
} from '@/modules/shared/components';

interface AddValueDialogProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    account: Account;
}

const createFormSchema = (t: (key: string) => string) =>
    z.object({
        value: z.coerce
            .number({
                error: () => ({ message: t('valueRequired') }),
            })
            .positive(t('valueMin')),
    });

type FormSchema = z.infer<ReturnType<typeof createFormSchema>>;

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};

export const AddValueDialog = ({ isOpen, setIsOpen, account }: AddValueDialogProps) => {
    const t = useTranslations('accounts');
    const ts = useTranslations('shared');
    const queryClient = useQueryClient();

    const formSchema = createFormSchema(t);

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            value: 0,
        },
    });

    const updateValueMutation = useMutation({
        mutationFn: ({ value }: { value: number }) =>
            updateAccountValue(account.$id, value, account.initial_value, account.type),
        mutationKey: [ACCOUNTS_QUERY_KEYS.UPDATE, 'value'],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ACCOUNTS_QUERY_KEYS.GET] });
            setIsOpen(false);
            form.reset();
            toast.success(t('valueAddedSuccess'));
        },
        onError: (error) => {
            toast.error(t('valueAddError'), {
                description: error.message,
            });
        },
    });

    const handleSubmit = form.handleSubmit(async (values) => {
        await updateValueMutation.mutateAsync({ value: values.value });
    });

    const isActiveAccount = account.type === AccountType.Active;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='sm:max-w-md'>
                <DialogHeader>
                    <DialogTitle>{t('addValueTitle')}</DialogTitle>
                    <DialogDescription>{t('addValueDescription')}</DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                    <div className='bg-muted/50 rounded-lg p-4 space-y-2'>
                        <div className='flex justify-between text-sm'>
                            <span className='text-muted-foreground'>{t('accountNameLabel')}:</span>
                            <span className='font-medium'>{account.name}</span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-muted-foreground'>{t('typeLabel')}:</span>
                            <span
                                className={`font-medium ${isActiveAccount ? 'text-green-600 dark:text-green-400' : 'text-blue-600 dark:text-blue-400'}`}
                            >
                                {isActiveAccount ? t('active') : t('passive')}
                            </span>
                        </div>
                        <div className='flex justify-between text-sm'>
                            <span className='text-muted-foreground'>{t('currentBalance')}:</span>
                            <span className='font-semibold'>
                                {formatCurrency(account.initial_value)}
                            </span>
                        </div>
                    </div>
                    <p className='text-sm text-muted-foreground'>
                        {isActiveAccount ? t('addValueActiveHint') : t('addValuePassiveHint')}
                    </p>
                    <form onSubmit={handleSubmit}>
                        <Controller
                            control={form.control}
                            name='value'
                            render={({ field, fieldState }) => {
                                const { ref, ...rest } = field;
                                return (
                                    <Field>
                                        <FieldLabel>{t('valueLabel')}</FieldLabel>
                                        <Input
                                            type='number'
                                            step='0.01'
                                            min='0.01'
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
                    </form>
                </div>
                <DialogFooter>
                    <Button
                        variant='outline'
                        onClick={() => setIsOpen(false)}
                        disabled={updateValueMutation.isPending}
                    >
                        {ts('cancel')}
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={updateValueMutation.isPending || !form.formState.isValid}
                    >
                        {updateValueMutation.isPending && (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        )}
                        {ts('confirm')}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
