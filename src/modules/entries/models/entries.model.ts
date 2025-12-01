export interface Entry {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    company_id: string;
    account_id: string;
    memo: string;
    debit: number;
    credit: number;
    date: string;
    diary_id?: string;
}

export interface EntryWithAccount extends Entry {
    account_name: string;
    account_code: string;
}

export interface GroupedEntries {
    month: string;
    entries: Entry[];
}