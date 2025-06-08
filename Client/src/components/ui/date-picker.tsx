import { format } from "date-fns";
import { enUS, he } from "date-fns/locale"; // Import locales
import { useTranslation } from "react-i18next"; // Import useTranslation
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  date?: Date;
  onSelect?: (date: Date | undefined) => void;
}

export function DatePicker({ date, onSelect }: DatePickerProps) {
  const { i18n, t } = useTranslation(); // Get the current language from i18n

  // Map the current language to the appropriate date-fns locale
  const locale = i18n.language === "he" ? he : enUS;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale }) // Format the date in the selected language
          ) : (
            <span>{t("pick_a_date")}</span>
          )}{" "}
          {/* Placeholder text */}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
