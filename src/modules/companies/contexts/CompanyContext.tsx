'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { SIDEBAR_QUERY_KEYS } from '@/modules/dashboard/constants';
import { useLocalStorage } from '@/modules/shared/hooks';
import { ACTIVE_COMPANY_ID_KEY, ACTIVE_COMPANY_NAME_KEY } from '../constants';

interface CompanyContextType {
    activeCompanyId: string;
    activeCompanyName: string;
    setActiveCompany: (id: string, name: string) => void;
    clearActiveCompany: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [activeCompanyId, setActiveCompanyId] = useLocalStorage(ACTIVE_COMPANY_ID_KEY, '');
    const [activeCompanyName, setActiveCompanyName] = useLocalStorage(ACTIVE_COMPANY_NAME_KEY, '');

    // Invalidate cache when company changes
    useEffect(() => {
        if (activeCompanyId) {
            queryClient.invalidateQueries({
                queryKey: [SIDEBAR_QUERY_KEYS.VALIDATION],
            });
        }
    }, [activeCompanyId, queryClient]);

    const setActiveCompany = (id: string, name: string) => {
        setActiveCompanyId(id);
        setActiveCompanyName(name);
    };

    const clearActiveCompany = () => {
        setActiveCompanyId('');
        setActiveCompanyName('');
    };

    return (
        <CompanyContext.Provider
            value={{
                activeCompanyId,
                activeCompanyName,
                setActiveCompany,
                clearActiveCompany,
            }}
        >
            {children}
        </CompanyContext.Provider>
    );
}

export function useActiveCompany() {
    const context = useContext(CompanyContext);
    if (context === undefined) {
        throw new Error('useActiveCompany must be used within a CompanyProvider');
    }
    return context;
}