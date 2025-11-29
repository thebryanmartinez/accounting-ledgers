'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { DeleteAccountDialog } from '@/modules/accounts/components/DeleteDialog';
import { EditAccountDialog } from '@/modules/accounts/components/EditDialog';
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
    hasChildren?: boolean;
}

export const AccountRowActions = ({ account, hasChildren = false }: AccountRowActionsProps) => {
    const t = useTranslations('accounts');
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
                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                        <Pencil className='mr-2 h-4 w-4' />
                        {t('edit')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsDeleteOpen(true)} variant='destructive'>
                        <Trash2 className='mr-2 h-4 w-4' />
                        {t('delete')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditAccountDialog isOpen={isEditOpen} setIsOpen={setIsEditOpen} account={account} />

            <DeleteAccountDialog
                isOpen={isDeleteOpen}
                setIsOpen={setIsDeleteOpen}
                accountId={account.$id}
                accountName={account.name}
                hasChildren={hasChildren}
            />
        </>
    );
};
