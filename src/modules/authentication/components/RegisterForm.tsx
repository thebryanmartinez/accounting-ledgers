"use client"

import {
    Card,
    CardHeader,
    CardFooter,
    Button,
    CardTitle,
    CardDescription,
    CardContent,
    Input, Field, FieldLabel, FieldError,
} from '@/modules/shared/components'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {RegisterUserProps} from "@/modules/authentication/models";
import {REGISTER_USER_FORM_ID} from "@/modules/authentication/constants";
import {useRouter} from "next/navigation";

interface RegisterFormProps {
    register: ({email, name, password}: RegisterUserProps) => Promise<void>
}

export const RegisterForm = ({ register }: RegisterFormProps) => {
    const t = useTranslations('authentication')
    const router = useRouter()

    const formSchema = z.object({
        name: z
            .string()
            .min(1, { message: t('nameRequired') })
            .min(2, { message: t('nameMinLength') }),
        email: z
            .email({ message: t('invalidEmail') })
            .min(1, { message: t('emailRequired') }),
        password: z
            .string()
            .min(1, { message: t('passwordRequired') })
            .min(6, { message: t('passwordMinLength') })
    })
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    })

    const registerUserMutation = useMutation({
        mutationFn: register,
        mutationKey: ['registerUser'],
        onSuccess: () => {
            router.push('/dashboard/companies')
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await registerUserMutation.mutate(values)
    }

    return (
        <Card className='min-h-[375px] justify-between'>
            <CardHeader>
                <CardTitle>{t('registerTitle')}</CardTitle>
                <CardDescription>
                    {t('registerDescription')}
                </CardDescription>
            </CardHeader>
            <CardContent className='space-y-2'>
                <form id={REGISTER_USER_FORM_ID}
                      className='space-y-2'
                      onSubmit={form.handleSubmit(onSubmit)}>
                        <Controller
                            control={form.control}
                            name='name'
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>{t('nameLabel')}</FieldLabel>
                                        <Input
                                            placeholder={t('namePlaceholder')}
                                            {...field}
                                        />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name='email'
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>{t('emailLabel')}</FieldLabel>
                                        <Input
                                            placeholder={t('emailPlaceholder')}
                                            {...field}
                                        />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                        <Controller
                            control={form.control}
                            name='password'
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel>{t('passwordLabel')}</FieldLabel>
                                        <Input
                                            placeholder={t('passwordPlaceholder')}
                                            {...field}
                                        />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                </form>
            </CardContent>
            <CardFooter>
                <Button
                    type='submit'
                    form={REGISTER_USER_FORM_ID}
                    disabled={registerUserMutation.isPending}
                >
                    {registerUserMutation.isPending && (
                        <Loader2 className='animate-spin' />
                    )}
                    {t('registerButton')}
                </Button>
            </CardFooter>
        </Card>
    )
}
