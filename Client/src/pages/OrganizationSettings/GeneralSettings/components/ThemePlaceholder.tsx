import { Button } from "@/components/ui/button";
import ThemeSelector from "./ThemeSelector";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import { orgSchema } from "..";

type FormValues = z.infer<typeof orgSchema>;

export default function ThemePlaceholder({
  watch,
  setValue,
}: {
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}) {
  return (
    <div className="bg-surface border rounded-md font-normal rtl:text-right ltr:text-left focus:outline-border outline-none px-3 py-2 flex gap-5 items-center">
      <div className="flex gap-5 items-center">
        <p className="text-muted-foreground">רקע</p>
        <div className="size-5 bg-background rounded-md" />
      </div>
      {/* Divider */}
      <div className="w-px h-6 bg-muted-foreground" />
      <div className="flex gap-5 items-center">
        <p className="text-muted-foreground">ראשי</p>
        <div className="size-5 bg-accent rounded-md" />
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-muted-foreground" />
      <div className="flex gap-5 items-center">
        <p className="text-muted-foreground">טקסט</p>
        <div className="size-5 bg-foreground rounded-md" />
      </div>
      <Popover>
        <PopoverTrigger asChild>
          {/* <div className="h-6 bg-background px-3 flex items-center rounded-lg cursor-pointer text-sm">
            ערוך
          </div> */}
          <Button className="h-6 px-3 text-sm">עריכה</Button>
        </PopoverTrigger>
        <PopoverContent>
          <ThemeSelector watch={watch} setValue={setValue} />
        </PopoverContent>
      </Popover>
    </div>
  );
}
