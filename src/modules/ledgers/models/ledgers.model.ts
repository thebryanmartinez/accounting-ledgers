import { TableDefaultColumns } from '@/modules/shared/models';

export interface Ledger {
    name: string;
    period_start: Date;
    period_end: Date;
    account_id: string;
}

export interface LedgerTable extends TableDefaultColumns, Ledger {}
