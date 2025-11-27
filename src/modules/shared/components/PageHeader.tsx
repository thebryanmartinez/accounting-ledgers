import { JSX } from 'react';

import { Item, ItemActions, ItemContent, ItemDescription } from '@/modules/shared/components/item';
import { ItemTitle } from '@/modules/shared/components/item';

interface PageHeaderProps {
    title: string;
    description: string;
    children?: JSX.Element;
}

export const PageHeader = ({ title, description, children }: PageHeaderProps) => {
    return (
        <Item>
            <ItemContent>
                <ItemTitle className='text-2xl font-bold tracking-tight'>{title}</ItemTitle>
                <ItemDescription className='text-muted-foreground'>{description}</ItemDescription>
            </ItemContent>
            {children ?? <ItemActions>{children}</ItemActions>}
        </Item>
    );
};
