import {useLocalStorage} from '@/modules/shared/hooks'
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
                    <AlertDialogTitle>Delete company</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this company?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Confirm</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
