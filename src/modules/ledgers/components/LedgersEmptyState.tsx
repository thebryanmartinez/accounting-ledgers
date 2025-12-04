'use client';

import { useTranslations } from 'next-intl';

import { BookOpen } from 'lucide-react';

import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/modules/shared/components';

export const LedgersEmptyState = () => {
    const t = useTranslations('ledgers');

    return (
        <Empty>
            <EmptyMedia>
                <BookOpen className='size-12 text-muted-foreground' />
            </EmptyMedia>
            <EmptyHeader>
                <EmptyTitle>{t('noLedgersFound')}</EmptyTitle>
                <EmptyDescription>{t('noLedgersDescription')}</EmptyDescription>
            </EmptyHeader>
        </Empty>
    );
};
