import { useTranslations } from 'next-intl';

export const AccountHeader = () => {
    const t = useTranslations('accounts');
    return (
        <div>
            <h1 className='text-2xl font-bold tracking-tight'>{t('accountsTitle')}</h1>
            <p className='text-muted-foreground'>{t('manageYourAccounts')}</p>
        </div>
    );
};
