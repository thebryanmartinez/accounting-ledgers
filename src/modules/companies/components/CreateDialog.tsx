"use client"

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { z } from 'zod'
import { Button, Dialog, DialogTrigger } from '@/modules/shared/components'
import { CompanyDialogForm, formSchema } from './DialogForm'
import { useState } from 'react'
import {account} from "@/lib/appwrite";
import {COMPANIES_QUERY_KEYS} from "@/modules/companies/constants";
import {createCompany} from "@/modules/companies/api";

export const CreateCompanyDialog = () => {
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)

    const createCompanyMutation = useMutation({
        mutationFn: createCompany,
        mutationKey: [COMPANIES_QUERY_KEYS.POST],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEYS.GET] })
            setOpen(false)
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const user = await account.get()
        await createCompanyMutation.mutateAsync({
            user_id: user.$id,
            ...values
        })
    }

    return (
        <Dialog
            open={open}
            onOpenChange={setOpen}
        >
            <DialogTrigger asChild>
                <Button>
                    <Plus/>
                    Create
                </Button>
            </DialogTrigger>
            <CompanyDialogForm
                title='Create a new company'
                description='Diaries and accounts are created under a company. You can create
          multiple companies and switch between them.'
                onSubmit={onSubmit}
                onSubmitMutation={createCompanyMutation}
            />
        </Dialog>
    )
}
