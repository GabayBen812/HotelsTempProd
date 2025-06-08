// hooks/useLocalizedMap.ts
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export function useLocalizedMap<
  T extends { id: string | number; name: { en: string; he: string; ar: string } }
>(items: T[]) {
  const { i18n } = useTranslation();
  return useMemo(
    () =>
      Object.fromEntries(
        items.map((item) => [
          item.id,
          item.name[i18n.language as "he" | "en" | "ar"] || item.name.en,
        ])
      ),
    [items, i18n.language]
  );
}
