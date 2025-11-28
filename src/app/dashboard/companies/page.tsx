'use client';

import { useTranslations } from 'next-intl';

import { useQuery } from '@tanstack/react-query';

import { getCompanies } from '@/modules/companies/api';
import { CompanyCard, CreateCompanyDialog, SkeletonCard } from '@/modules/companies/components';
import {
    ACTIVE_COMPANY_ID_KEY,
    ACTIVE_COMPANY_NAME_KEY,
    COMPANIES_QUERY_KEYS,
} from '@/modules/companies/constants';
import { PageHeader } from '@/modules/shared/components';
import {
    GARBAGE_COLLECTION_TIME_INTERVAL,
    REFETCH_ON_MOUNT_BOOLEAN,
    REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
    STALE_TIME_INTERVAL,
} from '@/modules/shared/constants';
import { useLocalStorage } from '@/modules/shared/hooks';

export default function Companies() {
    const t = useTranslations('companies');

    const { data: companies, isPending } = useQuery({
        queryKey: [COMPANIES_QUERY_KEYS.GET],
        queryFn: getCompanies,
        staleTime: STALE_TIME_INTERVAL,
        gcTime: GARBAGE_COLLECTION_TIME_INTERVAL,
        refetchOnWindowFocus: REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
        refetchOnMount: REFETCH_ON_MOUNT_BOOLEAN,
    });

    const [activeCompanyId, setActiveCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');
    const [, setActiveCompanyName] = useLocalStorage(ACTIVE_COMPANY_NAME_KEY, '');

    return (
        <section className='space-y-6'>
            <PageHeader title={t('companiesTitle')} description={t('companiesDescription')}>
                <CreateCompanyDialog />
            </PageHeader>

            {isPending ? (
                <article className='grid lg:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-4'>
                    <SkeletonCard />
                    <SkeletonCard />
                </article>
            ) : companies?.total === 0 ? (
                <div className='flex h-full col-span-full w-full flex-col items-center justify-center'>
                    <h2 className='text-2xl font-bold'>{t('noCompaniesFound')}</h2>
                    <p className='text-muted'>{t('createCompanyToGetStarted')}</p>
                </div>
            ) : (
                <article className='grid lg:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-4'>
                    {companies?.rows.map((company) => (
                        <CompanyCard
                            key={company.$id}
                            id={company.$id}
                            name={company.name}
                            description={company.description ?? ''}
                            isActive={activeCompanyId === company.$id}
                            onClickSetAsActive={() => {
                                setActiveCompanyId(company.$id);
                                setActiveCompanyName(company.name);
                            }}
                        />
                    ))}
                </article>
            )}
        </section>
    );
}
