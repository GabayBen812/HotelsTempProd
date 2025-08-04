import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import GlobeIcon from "@/assets/icons/GlobeIcon";
import { languages } from "@/i18n/languages";
import { Check, ChevronDown } from "lucide-react";
import { useRTL } from "@/hooks/useRtl";

function LanguagePicker() {
  const { textAlign, flexDirection } = useRTL();
  const { i18n, t } = useTranslation();
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const currentLanguage = languages.find((l) => l.code === i18n.language);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          size="default"
          variant="outline"
          className="w-fit flex items-center gap-2 rtl:flex-row-reverse ltr:flex-row hover:bg-muted transition-colors"
        >
          <div className="flex items-center gap-2">
            {currentLanguage ? (
              <>
                <span className="text-lg leading-none">
                  {currentLanguage.flag}
                </span>
                <span className="font-medium text-sm">
                  {currentLanguage.name}
                </span>
              </>
            ) : (
              <>
                <GlobeIcon />
                <span className="font-medium text-sm">
                  {t("Select language")}
                </span>
              </>
            )}
          </div>
          <ChevronDown size={14} className="opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg shadow-lg border"
        align="start"
        sideOffset={8}
      >
        <DropdownMenuLabel className="px-3 py-2 font-semibold text-sm text-muted-foreground">
          {t("languages")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-64 overflow-y-auto">
          {languages.map((language) => {
            const isSelected = language.code === i18n.language;

            return (
              <DropdownMenuItem
                key={language.code}
                onClick={() => changeLanguage(language.code)}
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-muted focus:bg-muted rounded-sm mx-1"
              >
                <div className={`flex items-center gap-3 ${flexDirection}`}>
                  <span className="text-lg leading-none w-6 text-center">
                    {language.flag}
                  </span>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{language.name}</span>
                    <span
                      className={`text-xs text-muted-foreground uppercase ${textAlign}`}
                    >
                      {language.code}
                    </span>
                  </div>
                </div>
                {isSelected && <Check size={16} className="text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguagePicker;
