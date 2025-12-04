import { Entry, GroupedEntries } from '@/modules/entries/models';

/**
 * Groups entries by month in format "YYYY-MM"
 * Returns entries grouped with month label and sorted by newest first
 */
export const groupEntriesByMonth = (entries: Entry[]): GroupedEntries[] => {
    // Group entries by year-month
    const grouped = entries.reduce(
        (acc, entry) => {
            const date = new Date(entry.date);
            const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!acc[yearMonth]) {
                acc[yearMonth] = [];
            }
            acc[yearMonth].push(entry);

            return acc;
        },
        {} as Record<string, Entry[]>
    );

    // Convert to array and sort by month (newest first)
    return Object.entries(grouped)
        .map(([month, entries]) => ({
            month,
            entries,
        }))
        .sort((a, b) => b.month.localeCompare(a.month));
};

/**
 * Formats a month string from "YYYY-MM" to "Month YYYY"
 * Example: "2024-01" -> "January 2024"
 */
export const formatMonthLabel = (yearMonth: string, locale: string = 'en-US'): string => {
    const [year, month] = yearMonth.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);

    const formatted = date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

/**
 * Formats a date string to short format
 * Example: "2024-01-15" -> "01/15/2024"
 */
export const formatDate = (dateString: string, locale: string = 'en-US'): string => {
    const date = new Date(dateString);

    // Force UTC to avoid timezone shifts
    const utcDate = new Date(date.valueOf() + date.getTimezoneOffset() * 60000);

    return utcDate.toLocaleDateString(locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

/**
 * Formats currency value
 */
export const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value);
};