'use client';

import { useEffect } from 'react';

import { useActiveCompany } from '@/modules/companies/contexts';

interface CompanyIdSyncProps {
    companyId: string;
}

export function CompanyIdSync({ companyId }: CompanyIdSyncProps) {
    const { setActiveCompany } = useActiveCompany();

    useEffect(() => {
        if (companyId) {
            setActiveCompany(companyId, '');
        }
    }, [companyId, setActiveCompany]);

    return null;
}
