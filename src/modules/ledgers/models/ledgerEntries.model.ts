export interface LedgerEntry {
    $id: string;
    ledger_id: string;
    account_id: string;
    date: Date;
    description: string;
    credit: number;
    debit: number;
    reference_number: string;
    $created_at: Date;
    $updated_at: Date;
}
