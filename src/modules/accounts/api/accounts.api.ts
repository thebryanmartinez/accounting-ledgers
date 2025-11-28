import { Client, ID, Query, TablesDB } from 'appwrite';

import { Account, AccountType } from '@/modules/accounts/models';

interface CreateAccountProps {
    company_id: string;
    name: string;
    initial_value?: number;
    type?: AccountType;
    parent_id?: string;
    id: string;
}

interface UpdateAccountProps {
    name?: string;
    type?: AccountType;
}

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const tableProperties = {
    databaseId: process.env.NEXT_PUBLIC_ACCOUNTING_LEDGERS_DATABASE_ID!,
    tableId: process.env.NEXT_PUBLIC_ACCOUNTS_TABLE!,
};
const tablesDB = new TablesDB(client);

export const createAccount = async (values: CreateAccountProps) => {
    try {
        return await tablesDB.createRow({
            ...tableProperties,
            rowId: ID.unique(),
            data: {
                ...values,
            },
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateAccount = async (id: string, data: UpdateAccountProps): Promise<Account> => {
    try {
        const response = await tablesDB.updateRow({
            ...tableProperties,
            rowId: id,
            data,
        });

        return response as unknown as Account;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateAccountValue = async (
    id: string,
    value: number,
    currentValue: number,
    accountType: AccountType
): Promise<Account> => {
    try {
        const newValue =
            accountType === AccountType.Active ? currentValue + value : currentValue - value;

        const response = await tablesDB.updateRow({
            ...tableProperties,
            rowId: id,
            data: {
                initial_value: newValue,
            },
        });

        return response as unknown as Account;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteAccount = async (id: string): Promise<void> => {
    try {
        // First, find all child accounts (subaccounts)
        const childrenResponse = await tablesDB.listRows({
            ...tableProperties,
            queries: [Query.equal('parent_id', id)],
        });

        // Delete all child accounts recursively
        if (childrenResponse.rows && childrenResponse.rows.length > 0) {
            for (const child of childrenResponse.rows as unknown as Account[]) {
                await deleteAccount(child.id);
            }
        }

        // Then delete the parent account
        await tablesDB.deleteRow({
            ...tableProperties,
            rowId: id,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getParentAccounts = async (company_id: string): Promise<Account[]> => {
    try {
        const response = await tablesDB.listRows({
            ...tableProperties,
            queries: [
                Query.equal('company_id', company_id),
                Query.isNull('parent_id'),
                Query.orderAsc('id'),
            ],
        });

        return response.rows as unknown as Account[];
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getAllAccountsForHierarchy = async (company_id: string): Promise<Account[]> => {
    try {
        const response = await tablesDB.listRows({
            ...tableProperties,
            queries: [Query.equal('company_id', company_id), Query.orderAsc('id')],
        });

        return response.rows as unknown as Account[];
    } catch (error) {
        console.error(error);
        throw error;
    }
};
