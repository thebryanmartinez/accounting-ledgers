'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { MoreHorizontal, Pencil, PlusCircle, Trash2 } from 'lucide-react';

import { AddValueDialog } from '@/modules/accounts/components/AddValueDialog';
import { DeleteAccountDialog } from '@/modules/accounts/components/DeleteAccountDialog';
import { EditAccountDialog } from '@/modules/accounts/components/EditAccountDialog';
import { Account } from '@/modules/accounts/models';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/modules/shared/components';

interface AccountRowActionsProps {
    account: Account;
}

export const AccountRowActions = ({ account }: AccountRowActionsProps) => {
    const t = useTranslations('accounts');
    const [isAddValueOpen, setIsAddValueOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' className='h-8 w-8'>
                        <MoreHorizontal className='h-4 w-4' />
                        <span className='sr-only'>{t('openMenu')}</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem onClick={() => setIsAddValueOpen(true)}>
                        <PlusCircle className='mr-2 h-4 w-4' />
                        {t('addValue')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        <Pencil className='mr-2 h-4 w-4' />
                        {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setIsDeleteOpen(true)}
                        variant='destructive'
                    >
                        <Trash2 className='mr-2 h-4 w-4' />
                        {t('delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AddValueDialog
                isOpen={isAddValueOpen}
                setIsOpen={setIsAddValueOpen}
                account={account}
            />

            <EditAccountDialog
                isOpen={isEditOpen}
                setIsOpen={setIsEditOpen}
                account={account}
            />

            <DeleteAccountDialog
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                accountId={account.$id}
                accountName={account.name}
            />
        </>
    );
};