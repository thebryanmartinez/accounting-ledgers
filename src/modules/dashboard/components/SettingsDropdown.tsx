'use client';

import React from 'react';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';

import { CheckIcon, Moon, Settings as SettingsIcon, Sun } from 'lucide-react';

import { useAuthentication } from '@/modules/authentication/hooks/useAuthentication';
import { useLocale } from '@/modules/shared/components/LocaleProvider';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from '@/modules/shared/components/dropdown-menu';
import { SidebarMenuButton, SidebarMenuItem } from '@/modules/shared/components/sidebar';

export function SettingsDropdown() {
    const t = useTranslations('dashboard');
    const { theme, setTheme } = useTheme();
    const { locale, setLocale } = useLocale();
    const { signOut } = useAuthentication();

    const changeTheme = () => {
        if (theme === 'dark') setTheme('light');
        else setTheme('dark');
    };

    const handleSignOut = () => {
        signOut();
    };

    return (
        <DropdownMenu>
            <SidebarMenuItem>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton asChild className="cursor-pointer">
                        <div className='flex w-full items-center'>
                            <SettingsIcon className='mr-2' />
                            <span>{t('settings')}</span>
                        </div>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuItem
                        onSelect={(e) => e.preventDefault()}
                        onClick={changeTheme}
                        className='flex justify-between items-center'
                    >
                        <span>{t('changeTheme')}</span>
                        {theme === 'dark' ? (
                            <Moon className='h-[1.2rem] w-[1.2rem]' />
                        ) : (
                            <Sun className='h-[1.2rem] w-[1.2rem]' />
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                            <span>{t('language')}</span>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => setLocale('en')}
                                className='flex justify-between items-center'
                            >
                                <span>{t('english')}</span>
                                {locale === 'en' && <CheckIcon className='h-4 w-4' />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={(e) => e.preventDefault()}
                                onClick={() => setLocale('es')}
                                className='flex justify-between items-center'
                            >
                                <span>{t('spanish')}</span>
                                {locale === 'es' && <CheckIcon className='h-4 w-4' />}
                            </DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} variant='destructive'>
                        {t('signOut')}
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </SidebarMenuItem>
        </DropdownMenu>
    );
}
