'use client';

import { useTranslations } from 'next-intl';

import { FileSpreadsheet } from 'lucide-react';

export const AccountsEmptyState = () => {
    const t = useTranslations('accounts');

    return (
        <div className='flex flex-col items-center justify-center py-16 px-4'>
            <div className='bg-muted/50 rounded-full p-6 mb-6'>
                <FileSpreadsheet className='size-12 text-muted-foreground' />
            </div>
            <h3 className='text-xl font-semibold text-foreground mb-2'>
                {t('noAccountsFound')}
            </h3>
            <p className='text-muted-foreground text-center max-w-md'>
                {t('noAccountsDescription')}
            </p>
        </div>
    );
};