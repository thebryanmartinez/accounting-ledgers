import {Client, ID, TablesDB} from "appwrite";

interface Companies {
    name: string
    description?: string;
}

interface CreateCompanyProps extends Companies {
    user_id: string;
}

interface UpdateCompanyProps extends Companies {
    $id: string;
}

const client = new Client().setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!).setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const tableProperties = {
    databaseId: process.env.NEXT_PUBLIC_ACCOUNTING_LEDGERS_DATABASE_ID!,
    tableId: process.env.NEXT_PUBLIC_COMPANIES_TABLE!,
}
const tablesDB = new TablesDB(client);

export const getCompanies = async () => {
    try {
        return await tablesDB.listRows({
            ...tableProperties,
        })
    } catch (error) {
        console.error(error)
    }
}

export const createCompany = async (values: CreateCompanyProps) => {
    try {
        return await tablesDB.createRow({
            ...tableProperties,
            rowId: ID.unique(),
            data: values,
        })
    } catch (error) {
        console.error(error)
    }
}

export const deleteCompany = async (rowId: string) => {
    try {

        return await tablesDB.deleteRow({
            ...tableProperties,
            rowId
        })
    } catch (error) {
        console.error(error)
    }
}

export const updateCompany = async (values: UpdateCompanyProps) => {
    try {
        const {name, description} = values
        return await tablesDB.updateRow({
            ...tableProperties,
            rowId: values.$id,
            data: {
                name,
                description
            }
        })
    } catch (error) {
        console.error(error)
    }
}