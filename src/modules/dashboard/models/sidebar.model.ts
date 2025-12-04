import { ForwardRefExoticComponent, RefAttributes } from 'react';
import { LucideProps } from 'lucide-react';

export interface SidebarLink {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    disabled?: boolean;
    tooltipContent?: string;
}

export interface SidebarGroupConfig {
    label: string;
    links: SidebarLink[];
}

export interface ValidationState {
    hasActiveCompany: boolean;
    hasAccounts: boolean;
    hasEntries: boolean;
    isLoading: boolean;
}

export interface SidebarPermissions {
    canViewAccounts: boolean;
    canViewDiaries: boolean;
    canViewEntries: boolean;
    canViewLedgers: boolean;
}