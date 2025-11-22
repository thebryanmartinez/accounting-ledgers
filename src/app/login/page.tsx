"use client"

import {LoginForm, RegisterForm} from '@/modules/authentication/components';
import {Button, Tabs, TabsContent, TabsList, TabsTrigger} from "@/modules/shared/components";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useAuthentication} from "@/modules/authentication/hooks";

export default function LoginPage() {
    const queryClient = new QueryClient()
    const { register, login, logout } = useAuthentication()

    return (
        <QueryClientProvider client={queryClient}>

            <div className='flex h-screen items-center justify-center'>
                <Tabs
                    defaultValue='login'
                    className='w-[400px]'
                >
                    <TabsList>
                        <TabsTrigger value='login'>Login</TabsTrigger>
                        <TabsTrigger value='register'>Register</TabsTrigger>
                    </TabsList>
                    <TabsContent value='login'>
                        <LoginForm login={login} />
                    </TabsContent>
                    <TabsContent value='register'>
                        <RegisterForm register={register}/>
                    </TabsContent>
                </Tabs>
                <Button onClick={logout}>Logout</Button>
            </div>
        </QueryClientProvider>

    );
}
