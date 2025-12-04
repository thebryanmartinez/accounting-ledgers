import { Client, ID, Query, TablesDB } from 'appwrite';

import { Ledger, LedgerTable } from '@/modules/ledgers/models';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const tableProperties = {
    databaseId: process.env.NEXT_PUBLIC_ACCOUNTING_LEDGERS_DATABASE_ID!,
    tableId: process.env.NEXT_PUBLIC_LEDGERS_TABLE!,
};

const tablesDB = new TablesDB(client);

export const getLedgers = async (companyId: string) => {
    try {
        const response = await tablesDB.listRows({
            ...tableProperties,
            queries: [Query.equal('company_id', companyId), Query.orderAsc('account_id')],
        });

        return response.rows as unknown as LedgerTable[];
    } catch (error) {
        throw error;
    }
};

export const createLedger = async (ledger: Ledger) => {
    try {
        return await tablesDB.createRow({
            ...tableProperties,
            rowId: ID.unique(),
            data: ledger,
        });
    } catch (error) {
        throw error;
    }
};

export const deleteLedger = async (id: string) => {
    try {
        await tablesDB.deleteRow({
            ...tableProperties,
            rowId: id,
        });
    } catch (error) {
        throw error;
    }
};

export const updateLedger = async (id: string, ledger: Ledger) => {
    try {
        return await tablesDB.updateRow({
            ...tableProperties,
            rowId: id,
            data: ledger,
        });
    } catch (error) {
        throw error;
    }
};
