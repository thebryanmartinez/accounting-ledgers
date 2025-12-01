'use client';

import { ReactNode } from 'react';

import { useRouter } from 'next/navigation';

import { useQuery } from '@tanstack/react-query';

import { account } from '@/lib/appwrite';
import { Spinner } from '@/modules/shared/components/spinner';
import {
    SESSION_CHECK_GARBAGE_COLLECTION_TIME_INTERVAL,
    SESSION_CHECK_STALE_TIME_INTERVAL,
} from '@/modules/shared/constants';

interface AuthGuardProps {
    children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();

    const { isLoading, error } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: () => account.get(),
        refetchInterval: SESSION_CHECK_STALE_TIME_INTERVAL,
        refetchOnWindowFocus: false,
        retry: false,
        gcTime: SESSION_CHECK_GARBAGE_COLLECTION_TIME_INTERVAL,
    });

    if (isLoading) {
        return (
            <div className='w-full h-dvh grid place-items-center'>
                <Spinner className='size-8' />
            </div>
        );
    }

    if (error) {
        router.push('/login');
        return null;
    }

    return <>{children}</>;
}
