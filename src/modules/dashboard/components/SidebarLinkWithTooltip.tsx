'use client';

import Link from 'next/link';

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/modules/shared/components/tooltip';
import { SidebarMenuButton } from '@/modules/shared/components/sidebar';
import { SidebarLink } from '@/modules/dashboard/models/sidebar.model';

interface SidebarLinkWithTooltipProps {
    link: SidebarLink;
}

export const SidebarLinkWithTooltip = ({ link }: SidebarLinkWithTooltipProps) => {
    const content = (
        <SidebarMenuButton asChild disabled={link.disabled}>
            {link.disabled ? (
                <div className='cursor-not-allowed opacity-50'>
                    <link.icon />
                    <span>{link.title}</span>
                </div>
            ) : (
                <Link href={link.url}>
                    <link.icon />
                    <span>{link.title}</span>
                </Link>
            )}
        </SidebarMenuButton>
    );

    if (link.disabled && link.tooltipContent) {
        return (
            <TooltipProvider delayDuration={300}>
                <Tooltip>
                    <TooltipTrigger asChild>{content}</TooltipTrigger>
                    <TooltipContent side='right'>
                        <p className='max-w-xs'>{link.tooltipContent}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );
    }

    return content;
};