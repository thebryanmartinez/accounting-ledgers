export enum AccountType {
    Active = 'active',
    Passive = 'passive',
}

export enum ActiveSubtypes {
    CurrentAssets = 'current_assets',
    NonCurrentAssets = 'non_current_assets',
    FixedAssets = 'fixed_assets',
    BankAccounts = 'bank_accounts',
    Cash = 'cash',
}

export enum PassiveSubtypes {
    CreditCard = 'credit_card',
    CurrentLiabilities = 'current_liabilities',
    NonCurrentLiabilities = 'non_current_liabilities',
}

export type AccountSubtype = ActiveSubtypes | PassiveSubtypes;

export interface Account {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    company_id: string;
    name: string;
    debit: number;
    credit: number;
    type: AccountType;
    subtype: AccountSubtype;
    id: string;
    parent_id?: string;
}

export interface HierarchicalAccount extends Account {
    children: Account[];
    level: number;
    isLastChild: boolean;
}
