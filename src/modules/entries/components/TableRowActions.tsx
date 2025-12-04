'use client';

import { useState } from 'react';

import { useTranslations } from 'next-intl';

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { DeleteEntryDialog } from '@/modules/entries/components/DeleteDialog';
import { EditEntryDialog } from '@/modules/entries/components/EditDialog';
import { Entry } from '@/modules/entries/models';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/modules/shared/components';

interface EntryRowActionsProps {
    entry: Entry;
}

export const EntryRowActions = ({ entry }: EntryRowActionsProps) => {
    const t = useTranslations('entries');
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

            <EditEntryDialog isOpen={isEditOpen} setIsOpen={setIsEditOpen} entry={entry} />

            <DeleteEntryDialog isOpen={isDeleteOpen} setIsOpen={setIsDeleteOpen} entry={entry} />
        </>
    );
};