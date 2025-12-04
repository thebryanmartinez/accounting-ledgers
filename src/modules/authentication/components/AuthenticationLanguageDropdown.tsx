"use client";

import React from "react";

import { useTranslations } from "next-intl";
import { CheckIcon, Globe2 } from "lucide-react";

import { useLocale } from "@/modules/shared/components/LocaleProvider";
import { Button } from "@/modules/shared/components";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/modules/shared/components/dropdown-menu";

const LANGUAGE_CODE_MAP: Record<string, string> = {
  en: "EN",
  es: "ES",
};

export function AuthenticationLanguageDropdown() {
  const t = useTranslations("authentication");
  const { locale, setLocale } = useLocale();

  const currentCode =
    LANGUAGE_CODE_MAP[locale as keyof typeof LANGUAGE_CODE_MAP] ??
    locale.toUpperCase();

  const handleChangeLocale = (newLocale: string) => {
    if (newLocale === locale) return;
    setLocale(newLocale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          aria-label={t("language")}
        >
          <Globe2 className="h-4 w-4" />
          <span className="text-xs font-medium">{currentCode}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => handleChangeLocale("en")}
          className="flex items-center justify-between"
        >
          <span>{t("english")}</span>
          {locale === "en" && <CheckIcon className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          onClick={() => handleChangeLocale("es")}
          className="flex items-center justify-between"
        >
          <span>{t("spanish")}</span>
          {locale === "es" && <CheckIcon className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}