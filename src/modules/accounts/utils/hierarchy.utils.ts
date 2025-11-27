import { Account, HierarchicalAccount } from '@/modules/accounts/models';

export const buildAccountHierarchy = (accounts: Account[]): HierarchicalAccount[] => {
    const hierarchical: HierarchicalAccount[] = [];
    
    // Separate parent and child accounts
    const parentAccounts = accounts.filter((acc) => !acc.parent_id);
    const childAccounts = accounts.filter((acc) => acc.parent_id);
    
    // Build hierarchy
    parentAccounts.forEach((parent) => {
        // Add parent with level 0
        hierarchical.push({
            ...parent,
            children: [],
            level: 0,
            isLastChild: false,
        });
        
        // Find and add children
        const children = childAccounts.filter((child) => child.parent_id === parent.id);
        children.forEach((child, index) => {
            hierarchical.push({
                ...child,
                children: [],
                level: 1,
                isLastChild: index === children.length - 1,
            });
        });
    });
    
    return hierarchical;
};

export const paginateHierarchicalAccounts = (
    hierarchicalAccounts: HierarchicalAccount[],
    page: number,
    itemsPerPage: number
): {
    paginatedAccounts: HierarchicalAccount[];
    totalGroups: number;
} => {
    // Group accounts by parent
    const groups: HierarchicalAccount[][] = [];
    let currentGroup: HierarchicalAccount[] = [];
    
    hierarchicalAccounts.forEach((account) => {
        if (account.level === 0) {
            // Start new group
            if (currentGroup.length > 0) {
                groups.push(currentGroup);
            }
            currentGroup = [account];
        } else {
            // Add to current group
            currentGroup.push(account);
        }
    });
    
    // Push the last group
    if (currentGroup.length > 0) {
        groups.push(currentGroup);
    }
    
    // Paginate groups
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedGroups = groups.slice(startIndex, endIndex);
    
    // Flatten paginated groups
    const paginatedAccounts = paginatedGroups.flat();
    
    return {
        paginatedAccounts,
        totalGroups: groups.length,
    };
};