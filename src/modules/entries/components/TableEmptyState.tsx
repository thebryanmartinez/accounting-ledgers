'use client';

import { useTranslations } from 'next-intl';

import { Receipt } from 'lucide-react';

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/modules/shared/components';

export const EntriesEmptyState = () => {
    const t = useTranslations('entries');

    return (
        <Empty>
            <EmptyMedia>
                <Receipt className='size-12 text-muted-foreground' />
            </EmptyMedia>
            <EmptyHeader>
                <EmptyTitle>{t('noEntriesFound')}</EmptyTitle>
                <EmptyDescription>{t('noEntriesDescription')}</EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
};
