"use client"

import {useQuery} from '@tanstack/react-query'
import { useEffect } from 'react'
import {
    CompanyCard,
    CreateCompanyDialog,
    SkeletonCard
} from '@/modules/companies/components'
import {
    ACTIVE_COMPANY_ID_KEY,
    ACTIVE_COMPANY_NAME_KEY, COMPANIES_QUERY_KEYS
} from '@/modules/companies/constants'
import {useLocalStorage} from '@/modules/shared/hooks'
import {getCompanies} from "@/modules/companies/api";

export default function Companies() {

    const {data: companies, isPending} = useQuery({
        queryKey: [COMPANIES_QUERY_KEYS.GET],
        queryFn: getCompanies
    })

    const [activeCompanyId, setActiveCompanyId] = useLocalStorage(
        ACTIVE_COMPANY_ID_KEY,
        ''
    )
    const [, setActiveCompanyName] = useLocalStorage(ACTIVE_COMPANY_NAME_KEY, '')

    useEffect(() => {
        const logDimensions = () => {
            console.log('Window width:', window.innerWidth)
            const container = document.querySelector('main > div')
            if (container) {
                console.log('Container width:', container.clientWidth)
            }
        }
        logDimensions()
        window.addEventListener('resize', logDimensions)
        return () => window.removeEventListener('resize', logDimensions)
    }, [])

    return (
        <section className="h-full">
            <article className='pb-4'>
                <CreateCompanyDialog/>
            </article>

            {isPending ? (
                <article className="grid lg:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-4">
                    <SkeletonCard/>
                    <SkeletonCard/>
                </article>
            ) : companies?.total === 0 ? (
                <div className='flex h-full col-span-full w-full flex-col items-center justify-center'>
                    <h2 className='text-2xl font-bold'>No companies found</h2>
                    <p className='text-muted'>
                        Create a new company to get started.
                    </p>
                </div>
            ) : (
                <article className="grid lg:grid-cols-2 grid-cols-1 2xl:grid-cols-3 gap-4">
                    {companies?.rows.map((company) => (
                    <CompanyCard
                        key={company.$id}
                        id={company.$id}
                        name={company.name}
                        description={company.description ?? ''}
                        isActive={activeCompanyId === company.$id}
                        onClickSetAsActive={() => {
                            setActiveCompanyId(company.$id)
                            setActiveCompanyName(company.name)
                        }}
                    />
                ))}
                </article>
            )}
    </section>
    )
}
