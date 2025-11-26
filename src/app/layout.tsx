import type {Metadata} from "next";
import {NextIntlClientProvider} from 'next-intl';
import {getTranslations} from 'next-intl/server';
import {cookies} from 'next/headers';
import {Geist, Geist_Mono} from "next/font/google";
import {Toaster, ThemeProvider} from "@/modules/shared/components";
import {LocaleProvider} from "@/components/LocaleProvider";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const locale = cookieStore.get('locale')?.value || 'en';
    const t = await getTranslations({locale, namespace: 'shared'});

    return {
        title: t('title'),
        description: t('description'),
    };
}

export default async function RootLayout({
                                             children,
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const locale = cookieStore.get('locale')?.value || 'es';

    return (
        <html lang={locale}>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <LocaleProvider>
                <NextIntlClientProvider>
                    {children}
                </NextIntlClientProvider>
            </LocaleProvider>
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}
