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

export interface HierarchicalAccount extends Account {
    children: Account[];
    level: number;
    isLastChild: boolean;
}
