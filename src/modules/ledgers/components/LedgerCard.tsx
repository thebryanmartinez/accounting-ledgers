import { useTranslations } from 'next-intl';

import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/modules/shared/components';

interface LedgerCardProps {
    accountId: string;
    name: string;
    currentBalance: number;
    totalDebits: number;
    totalCredits: number;
    createdAt: Date;
}

export const LedgerCard = ({
    accountId,
    name,
    currentBalance,
    totalDebits,
    totalCredits,
    createdAt,
}: LedgerCardProps) => {
    const t = useTranslations('ledgers');

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
        }).format(date);
    };

    return (
        <Card className='w-full max-w-sm'>
            <CardHeader>
                <div className='bg-muted text-muted-foreground text-xs font-medium px-2 py-1 rounded w-fit mb-2'>
                    #{accountId}
                </div>
                <CardTitle className='text-2xl'>{name}</CardTitle>
            </CardHeader>

            <CardContent className='space-y-4'>
                <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground text-sm'>{t('currentBalance')}</span>
                    <span className='text-2xl font-bold'>{formatCurrency(currentBalance)}</span>
                </div>

                <hr />

                <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                        <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                            <ArrowUpRight className='h-4 w-4 text-green-500' />
                            <span>{t('totalDebits')}</span>
                        </div>
                        <div className='text-lg font-semibold'>{formatCurrency(totalDebits)}</div>
                    </div>

                    <div className='space-y-1'>
                        <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                            <ArrowDownRight className='h-4 w-4 text-red-500' />
                            <span>{t('totalCredits')}</span>
                        </div>
                        <div className='text-lg font-semibold'>{formatCurrency(totalCredits)}</div>
                    </div>
                </div>
                <hr />
            </CardContent>

            <CardFooter className='justify-between text-muted-foreground text-sm'>
                <span>
                    {t('createdOn')} {createdAt ? formatDate(new Date(createdAt)) : '-'}
                </span>
            </CardFooter>
        </Card>
    );
};
