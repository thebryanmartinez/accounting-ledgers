import { Client, ID, Query, TablesDB } from 'appwrite';

import { LedgerEntry } from '@/modules/ledgers/models';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const tableProperties = {
    databaseId: process.env.NEXT_PUBLIC_ACCOUNTING_LEDGERS_DATABASE_ID!,
    tableId: process.env.NEXT_PUBLIC_LEDGER_ENTRIES_TABLE!,
};

const tablesDB = new TablesDB(client);

export const getLedgerEntries = async () => {
    try {
        const response = await tablesDB.listRows({
            ...tableProperties,
            queries: [],
        });

        return response.rows as unknown as LedgerEntry[];
    } catch (error) {
        throw error;
    }
};

export const createLedgerEntries = async () => {
    try {
        // TODO: Bulk operations are permitted on the server side for Appwrite. Reasearch
        // how to implement this.
    } catch (error) {
        throw error;
    }
};
