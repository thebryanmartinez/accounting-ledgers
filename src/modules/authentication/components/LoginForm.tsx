import {
    Card,
    CardHeader,
    CardFooter,
    Button,
    CardTitle,
    CardDescription,
    CardContent,
    Input, Field, FieldError, FieldLabel,
} from '@/modules/shared/components'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import {LoginUserProps} from "@/modules/authentication/models";
import {LOGIN_USER_FORM_ID} from "@/modules/authentication/constants";

interface LoginFormProps {
    login: ({email, password}: LoginUserProps) => Promise<void>
}

const formSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email is required' })
        .email({ message: 'Invalid email address' }),
    password: z
        .string()
        .min(1, { message: 'Password is required' })
        .min(6, { message: 'Password must be at least 6 characters long' })
})

export const LoginForm = ({login}: LoginFormProps) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const loginUserMutation = useMutation({
        mutationFn: login,
        mutationKey: ['loginUser'],
        onSuccess: () => {
            console.log('Successfully logged in')
        }
    })
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        await loginUserMutation.mutateAsync(values)
    }

    return (
        <Card className='min-h-[375px] justify-between'>
            <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                    Write your email and password to access your account.
                </CardDescription>
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
                                const { ref, ...rest } = field
                                return (
                                    <Field>
                                        <FieldLabel>Email</FieldLabel>
                                            <Input
                                                placeholder='Type your email'
                                                {...rest}
                                            />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )
                            }}
                        />
                        <Controller
                            control={form.control}
                            name='password'
                            render={({ field, fieldState }) => {
                                const { ref, ...rest } = field
                                return (
                                    <Field>
                                        <FieldLabel>Password</FieldLabel>
                                            <Input
                                                placeholder='Type your password'
                                                {...rest}
                                            />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} />
                                        )}
                                    </Field>
                                )
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
                    Login
                </Button>
            </CardFooter>
        </Card>
    )
}
