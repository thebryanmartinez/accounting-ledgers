import { Client, ID, TablesDB } from 'appwrite';

import { AccountType } from '@/modules/accounts/models';

interface CreateAccountProps {
    company_id: string;
    name: string;
    initial_value?: number;
    type?: AccountType;
    parent_id?: string;
    id: string;
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

export const getAccounts = async () => {
    try {
        return await tablesDB.listRows({
            ...tableProperties,
        });
    } catch (error) {
        console.error(error);
    }
};
