'use client';

import { useTranslations } from 'next-intl';

import { Receipt } from 'lucide-react';

export const EntriesEmptyState = () => {
    const t = useTranslations('entries');

    return (
        <div className='flex flex-col items-center justify-center py-16 px-4'>
            <div className='bg-muted/50 rounded-full p-6 mb-6'>
                <Receipt className='size-12 text-muted-foreground' />
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-2'>{t('noEntriesFound')}</h3>
            <p className='text-muted-foreground text-center max-w-md'>
                {t('noEntriesDescription')}
            </p>
        </div>
    );
};