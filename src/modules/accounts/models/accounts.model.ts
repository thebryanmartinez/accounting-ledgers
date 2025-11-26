export enum AccountType {
    Active = 'active',
    Passive = 'passive',
}

export interface Account {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    company_id: string;
    name: string;
    initial_value: number;
    type: AccountType;
    id: string;
    parent_id?: string;
}

export interface PaginatedAccountsResponse {
    rows: Account[];
    total: number;
}

export interface GetAccountsParams {
    company_id: string;
    limit?: number;
    offset?: number;
}
