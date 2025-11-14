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
import {RegisterUserProps} from "@/modules/authentication/models";
import {REGISTER_USER_FORM_ID} from "@/modules/authentication/constants";

interface RegisterFormProps {
    register: ({email, name, password}: RegisterUserProps) => Promise<void>
}

const formSchema = z.object({
    name: z
        .string()
        .min(1, { message: 'Name is required' })
        .min(2, { message: 'Name must be at least 2 characters long' }),
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters long' })
})

export const RegisterForm = ({ register }: RegisterFormProps) => {
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
            // navigate('/dashboard')
            console.log("Successful registration")
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await registerUserMutation.mutate(values)
    }

    return (
        <Card className='min-h-[375px] justify-between'>
            <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>
                    Enter the following information to create an account.
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
                                    <FieldLabel>Name</FieldLabel>
                                        <Input
                                            placeholder='John Doe'
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
                                    <FieldLabel>Email</FieldLabel>
                                        <Input
                                            placeholder='john@email.com'
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
                                    <FieldLabel>Password</FieldLabel>
                                        <Input
                                            placeholder='password123'
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
                    Register
                </Button>
            </CardFooter>
        </Card>
    )
}
