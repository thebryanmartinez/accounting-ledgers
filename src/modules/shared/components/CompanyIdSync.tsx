'use client';

import { useEffect } from 'react';

import { ACTIVE_COMPANY_ID_KEY } from '@/modules/companies/constants';
import { useLocalStorage } from '@/modules/shared/hooks';

interface CompanyIdSyncProps {
    companyId: string;
}

export function CompanyIdSync({ companyId }: CompanyIdSyncProps) {
    const [, setActiveCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');

    useEffect(() => {
        if (companyId) {
            setActiveCompanyId(companyId);
        }
    }, [companyId, setActiveCompanyId]);

    return null;
}
