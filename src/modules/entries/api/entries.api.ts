import { Client, ID, Query, TablesDB } from 'appwrite';

import { Entry } from '@/modules/entries/models';

interface CreateEntryProps {
    company_id: string;
    account_id: string;
    memo: string;
    debit: number;
    credit: number;
    date: string;
    diary_id?: string;
}

interface UpdateEntryProps {
    account_id?: string;
    memo?: string;
    debit?: number;
    credit?: number;
    date?: string;
    diary_id?: string;
}

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const tableProperties = {
    databaseId: process.env.NEXT_PUBLIC_ACCOUNTING_LEDGERS_DATABASE_ID!,
    tableId: process.env.NEXT_PUBLIC_ENTRIES_TABLE!,
};

const tablesDB = new TablesDB(client);

export const createEntry = async (values: CreateEntryProps): Promise<Entry> => {
    try {
        const response = await tablesDB.createRow({
            ...tableProperties,
            rowId: ID.unique(),
            data: values,
        });

        return response as unknown as Entry;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const updateEntry = async (id: string, data: UpdateEntryProps): Promise<Entry> => {
    try {
        const response = await tablesDB.updateRow({
            ...tableProperties,
            rowId: id,
            data,
        });

        return response as unknown as Entry;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const deleteEntry = async (id: string): Promise<void> => {
    try {
        await tablesDB.deleteRow({
            ...tableProperties,
            rowId: id,
        });
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const getEntriesByCompany = async (company_id: string): Promise<Entry[]> => {
    try {
        const response = await tablesDB.listRows({
            ...tableProperties,
            queries: [Query.equal('company_id', company_id), Query.orderDesc('date')],
        });

        return response.rows as unknown as Entry[];
    } catch (error) {
        console.error(error);
        throw error;
    }
};