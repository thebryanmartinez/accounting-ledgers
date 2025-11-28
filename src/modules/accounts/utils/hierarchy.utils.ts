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