import { AccountSubtype, AccountType, ActiveSubtypes } from '@/modules/accounts/models';

export const getAccountTypeFromSubtype = (subtype: AccountSubtype): AccountType => {
    if (Object.values(ActiveSubtypes).includes(subtype as unknown as ActiveSubtypes)) {
        return AccountType.Active;
    }
    return AccountType.Passive;
};
