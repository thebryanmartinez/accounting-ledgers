"use client"

import {useEffect} from 'react'
import {useAuthentication} from "@/modules/authentication/hooks";
import {useRouter} from "next/navigation";
import {account} from "@/lib/appwrite";


export default function Index() {
    const router = useRouter()
    const {current} = useAuthentication();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await account.get()
                if (user) {
                    router.push('/dashboard')
                } else {
                    router.push('/login')
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                router.push('/login')
            }
        }

        checkAuth()
    }, [current, router])
}
