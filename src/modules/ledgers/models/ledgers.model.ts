import { TableDefaultColumns } from '@/modules/shared/models';

export interface Ledger {
    name: string;
    period_start: Date;
    period_end: Date;
    account_id: string;
    total_debits: number;
    total_credits: number;
    current_balance: number;
    company_id: string;
}

export interface LedgerTable extends TableDefaultColumns, Ledger {}
