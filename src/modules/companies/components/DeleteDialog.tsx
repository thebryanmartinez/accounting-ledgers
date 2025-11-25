import {useLocalStorage} from '@/modules/shared/hooks'
import { useTranslations } from 'next-intl'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/modules/shared/components'
import {ACTIVE_COMPANY_ID_KEY, ACTIVE_COMPANY_NAME_KEY, COMPANIES_QUERY_KEYS} from '../constants'
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteCompany} from "@/modules/companies/api";

interface CompanyDeleteDialogProps {
    isOpen: boolean
    setIsOpen: (isOpen: boolean) => void
    deleteMutationCallback: () => void
    id: string
}

export const CompanyDeleteDialog = ({
         isOpen,
         setIsOpen,
     deleteMutationCallback,
         id
     }: CompanyDeleteDialogProps) => {
     const t = useTranslations('companies')
     const ts = useTranslations('shared')
     const queryClient = useQueryClient()
    const [, setActiveCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, "")
    const [, setActiveCompanyName] = useLocalStorage(ACTIVE_COMPANY_NAME_KEY, "")

    const deleteCompanyMutation = useMutation({
        mutationFn: deleteCompany,
        mutationKey: [COMPANIES_QUERY_KEYS.DELETE],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEYS.GET]})
            deleteMutationCallback()
        }
    })

    const handleDelete = () => {
        deleteCompanyMutation.mutateAsync(id)
        setActiveCompanyId('')
        setActiveCompanyName('')
    }

    return (
        <AlertDialog
            open={isOpen}
            onOpenChange={setIsOpen}
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('deleteCompany')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('deleteCompanyConfirmation')}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{ts('cancel')}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>{ts('confirm')}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
