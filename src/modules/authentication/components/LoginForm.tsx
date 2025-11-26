/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { LOGIN_USER_FORM_ID } from '@/modules/authentication/constants';
import { LoginUserProps } from '@/modules/authentication/models';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    Field,
    FieldError,
    FieldLabel,
    Input,
} from '@/modules/shared/components';

interface LoginFormProps {
    login: ({ email, password }: LoginUserProps) => Promise<void>;
}

export const LoginForm = ({ login }: LoginFormProps) => {
    const t = useTranslations('authentication');
    const router = useRouter();

    const formSchema = z.object({
        email: z.email({ message: t('invalidEmail') }).min(1, { message: t('emailRequired') }),
        password: z
            .string()
            .min(1, { message: t('passwordRequired') })
            .min(6, { message: t('passwordMinLength') }),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const loginUserMutation = useMutation({
        mutationFn: login,
        mutationKey: ['loginUser'],
        onSuccess: () => {
            router.push('/dashboard/companies');
        },
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await loginUserMutation.mutateAsync(values);
    };

    return (
        <Card className='min-h-[375px] justify-between'>
            <CardHeader>
                <CardTitle>{t('loginTitle')}</CardTitle>
                <CardDescription>{t('loginDescription')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-2'
                    id={LOGIN_USER_FORM_ID}
                >
                    <Controller
                        control={form.control}
                        name='email'
                        render={({ field, fieldState }) => {
                            const { ref, ...rest } = field;
                            return (
                                <Field>
                                    <FieldLabel>{t('emailLabel')}</FieldLabel>
                                    <Input placeholder={t('emailPlaceholder')} {...rest} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            );
                        }}
                    />
                    <Controller
                        control={form.control}
                        name='password'
                        render={({ field, fieldState }) => {
                            const { ref, ...rest } = field;
                            return (
                                <Field>
                                    <FieldLabel>{t('passwordLabel')}</FieldLabel>
                                    <Input placeholder={t('passwordPlaceholder')} {...rest} />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            );
                        }}
                    />
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    disabled={loginUserMutation.isPending}
                    type='submit'
                    form={LOGIN_USER_FORM_ID}
                >
                    {loginUserMutation.isPending && <Loader2 className='animate-spin' />}
                    {t('loginButton')}
                </Button>
            </CardFooter>
        </Card>
    );
};
