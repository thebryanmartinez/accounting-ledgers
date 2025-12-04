'use client';

import { useTranslations } from 'next-intl';

import { useQuery } from '@tanstack/react-query';

import { getCompanies } from '@/modules/companies/api';
import { CompanyCard, CreateCompanyDialog, SkeletonCard } from '@/modules/companies/components';
import { COMPANIES_QUERY_KEYS } from '@/modules/companies/constants';
import { useActiveCompany } from '@/modules/companies/contexts';
import { PageHeader } from '@/modules/shared/components';
import {
    GARBAGE_COLLECTION_TIME_INTERVAL,
    REFETCH_ON_MOUNT_BOOLEAN,
    REFETCH_ON_WINDOW_FOCUS_BOOLEAN,
    STALE_TIME_INTERVAL,
} from '@/modules/shared/constants';

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

    const { activeCompanyId, setActiveCompany } = useActiveCompany();

    return (
        <section className='space-y-6'>
            <PageHeader title={t('companiesTitle')} description={t('companiesDescription')}>
                <CreateCompanyDialog hasCompanies={companies ? companies.total > 0 : false} />
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
                                setActiveCompany(company.$id, company.name);
                            }}
                        />
                    ))}
                </article>
            )}
        </section>
    );
}
