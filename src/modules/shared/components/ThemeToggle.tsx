'use client';

import { useTheme } from 'next-themes';

import { Moon, Sun } from 'lucide-react';

import { Button } from '@/modules/shared/components';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const changeTheme = () => {
        if (theme === 'dark') setTheme('light');
        else setTheme('dark');
    };

    return (
        <Button size='icon' onClick={changeTheme}>
            <Sun className='h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
            <Moon className='absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
        </Button>
    );
}
