"use client"

import { useEffect } from 'react'
import {useAuthentication} from "@/modules/authentication/hooks";
import {useRouter} from "next/navigation";
import {account} from "@/lib/appwrite";


export default function Index() {
    const router = useRouter()
    const { current } = useAuthentication();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await account.get()
            if (!user) {
                router.push('/login')
            } else {
                router.push('/dashboard')
            }
        }

        checkAuth()
    }, [current, router])
}
