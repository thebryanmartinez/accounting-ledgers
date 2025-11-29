'use client';

import { useState } from 'react';

import { useRouter } from 'next/navigation';

import { ID } from 'appwrite';
import type { Models } from 'appwrite';

import { account } from '@/lib/appwrite';
import { LoginUserProps, RegisterUserProps } from '@/modules/authentication/models';

export const useAuthentication = () => {
    const [current, setCurrent] = useState<Models.Session | null>(null);
    const router = useRouter();

    const register = async ({ email, password, name }: RegisterUserProps): Promise<void> => {
        await account.create({
            userId: ID.unique(),
            name,
            email,
            password,
        });
        await login({ email, password });
    };

    const login = async ({ email, password }: LoginUserProps): Promise<void> => {
        const session = await account.createEmailPasswordSession({
            email,
            password,
        });
        setCurrent(session);
        router.push('/');
    };

    const signOut = async (): Promise<void> => {
        try {
            await account.deleteSession({sessionId: 'current'});
            setCurrent(null);
            router.push('/login');
        } catch (error) {
            console.error(error);
        }
    };

    return {
        current,
        login,
        signOut,
        register,
    };
};
