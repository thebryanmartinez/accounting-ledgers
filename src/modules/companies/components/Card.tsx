import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { Dialog, DialogTrigger } from '@radix-ui/react-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CircleCheckBig, MoreHorizontal } from 'lucide-react';
import { z } from 'zod';

import { COMPANIES_QUERY_KEYS } from '@/modules/companies/constants';
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/modules/shared/components';

import { updateCompany } from '../api';
// TODO: Fix formSchema export
import { CompanyDeleteDialog, CompanyDialogForm, formSchema } from '../components';

interface CompanyCardProps {
    id: string;
    name: string;
    description: string;
    onClickSetAsActive?: () => void;
    isActive?: boolean;
}

export function CompanyCard({
    id,
    name = 'company name',
    description = 'company description',
    onClickSetAsActive,
    isActive = false,
}: CompanyCardProps) {
    const t = useTranslations('companies');
    const queryClient = useQueryClient();

    const activeStyles = isActive ? 'border-2 border-primary' : '';

    const updateCompanyMutation = useMutation({
        mutationFn: updateCompany,
        mutationKey: [COMPANIES_QUERY_KEYS.UPDATE],
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COMPANIES_QUERY_KEYS.GET] });
            setIsEditDialogOpen(false);
        },
    });

    const onSubmitEdit = (values: z.infer<typeof formSchema>) => {
        updateCompanyMutation.mutateAsync({
            $id: id,
            ...values,
        });
    };

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    return (
        <>
            <Card className={`w-full md:min-w-[350px] h-[170px] ${activeStyles}`}>
                <CardHeader>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription className='h-[1rem]'>{description}</CardDescription>
                </CardHeader>
                <CardContent />
                <CardFooter className='justify-end gap-4'>
                    {isActive ? (
                        <span className='gap-1 items-center flex text-xs'>
                            <CircleCheckBig size={16} /> {name} {t('isActive')}
                        </span>
                    ) : (
                        <>
                            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <MoreHorizontal />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DialogTrigger asChild>
                                            <DropdownMenuItem
                                                onSelect={() => {
                                                    setIsEditDialogOpen(true);
                                                    document.body.style.pointerEvents = '';
                                                }}
                                            >
                                                {t('edit')}
                                            </DropdownMenuItem>
                                        </DialogTrigger>
                                        <DropdownMenuItem
                                            onSelect={() => {
                                                setIsDeleteDialogOpen(true);
                                                document.body.style.pointerEvents = '';
                                            }}
                                        >
                                            {t('delete')}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <CompanyDialogForm
                                    title={t('editCompany')}
                                    description={t('editCompanyDescription')}
                                    actionButtonText={t('saveChanges')}
                                    setDialogOpen={setIsEditDialogOpen}
                                    onSubmit={onSubmitEdit}
                                    onSubmitMutation={updateCompanyMutation}
                                    nameDefaultValue={name}
                                    descriptionDefaultValue={description}
                                />
                            </Dialog>

                            <Button variant='outline' onClick={onClickSetAsActive}>
                                {t('setAsActive')}
                            </Button>
                        </>
                    )}
                </CardFooter>
            </Card>

            <CompanyDeleteDialog
                setIsOpen={setIsDeleteDialogOpen}
                isOpen={isDeleteDialogOpen}
                id={id}
                deleteMutationCallback={() => setIsDeleteDialogOpen(false)}
            />
        </>
    );
}
