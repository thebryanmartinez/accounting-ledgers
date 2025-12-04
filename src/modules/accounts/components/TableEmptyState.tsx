'use client';

import { useTranslations } from 'next-intl';

import { FileSpreadsheet } from 'lucide-react';

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/modules/shared/components';

export const AccountsEmptyState = () => {
    const t = useTranslations('accounts');

    return (
        <Empty>
            <EmptyMedia>
                <FileSpreadsheet className='size-12 text-muted-foreground' />
            </EmptyMedia>
            <EmptyHeader>
                <EmptyTitle>{t('noAccountsFound')}</EmptyTitle>
                <EmptyDescription>{t('noAccountsDescription')}</EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
};
