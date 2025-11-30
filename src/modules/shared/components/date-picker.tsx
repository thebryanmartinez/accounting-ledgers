'use client';

import * as React from 'react';

import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/modules/shared/components/button';
import { Calendar } from '@/modules/shared/components/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shared/components/popover';
import { useLocale } from '@/modules/shared/components/LocaleProvider';

interface DatePickerProps {
    date?: Date;
    onSelect?: (date: Date | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
}

export function DatePicker({
    date,
    onSelect,
    placeholder = 'Pick a date',
    disabled = false,
    className,
}: DatePickerProps) {
    const { locale: userLocale } = useLocale();

    const dateFnsLocale = userLocale === 'es' ? es : enUS;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    data-empty={!date}
                    disabled={disabled}
                    className={cn(
                        'data-[empty=true]:text-muted-foreground w-full justify-start text-left font-normal',
                        className
                    )}
                >
                    <CalendarIcon />
                    {date ? format(date, 'PPP', { locale: dateFnsLocale }) : <span>{placeholder}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
                <Calendar mode='single' selected={date} onSelect={onSelect} autoFocus />
            </PopoverContent>
        </Popover>
    );
}