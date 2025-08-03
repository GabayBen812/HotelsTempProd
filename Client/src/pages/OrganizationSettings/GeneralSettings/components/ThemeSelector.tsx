import ColorPicker from "@/components/ui/color-picker";
import { Input } from "@/components/ui/Input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { useContext } from "react";
import { converter, formatHex } from "culori";
import { OrganizationsContext } from "@/contexts/OrganizationsContext";
import { CustomStyles } from "@/types/api/organization";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { orgSchema } from "..";
import { z } from "zod";
import { useEffect } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const hexToOklch = (hexColor: string): string => {
  const toOklch = converter("oklch");
  const color = toOklch(hexColor);

  if (!color || color.l === undefined || color.c === undefined) {
    return "0% 0 0";
  }

  const l = Math.max(0, Math.min(color.l * 100, 100)).toFixed(2);
  const c = Math.max(0, color.c).toFixed(4);

  const CHROMA_THRESHOLD = 0.0001;
  const h =
    color.c < CHROMA_THRESHOLD || color.h === undefined
      ? "0.00"
      : (((color.h % 360) + 360) % 360).toFixed(2); // Handle negative hues properly

  return `${l}% ${c} ${h}`;
};

export const oklchToHex = (oklchStr: string): string => {
  try {
    const [lRaw, cRaw, hRaw] = oklchStr.split(" ");
    if (!lRaw || !cRaw || !hRaw) return "#000000";

    const l = parseFloat(lRaw) / 100;
    const c = parseFloat(cRaw);
    const h = parseFloat(hRaw);

    const toHex = formatHex({ mode: "oklch", l, c, h });
    return toHex;
  } catch {
    return "#000000";
  }
};

type LabelName = { label: keyof CustomStyles; value: string };

const labelNames: LabelName[] = [
  { label: "foreground", value: "טקסט" },
  { label: "accent", value: "ראשי" },
  { label: "primary", value: "כותרת" },
  { label: "muted-foreground", value: "טקסט משני" },
  { label: "border", value: "מסגרת" },
  { label: "background", value: "רקע" },
  { label: "surface", value: "משטח" },
];

type FormValues = z.infer<typeof orgSchema>;

export default function ThemeSelector({
  watch,
  setValue,
}: {
  watch: UseFormWatch<FormValues>;
  setValue: UseFormSetValue<FormValues>;
}) {
  const theme = watch("theme");
  const { setOrganizationLocally } = useContext(OrganizationsContext);

  const changeColors = (): void => {
    setOrganizationLocally({
      customStyles: watch("theme"),
    });
  };

  useEffect(() => {
    changeColors();
  }, [JSON.stringify(watch("theme"))]);

  const presets = [
    {
      name: "Classic",
      theme: {
        accent: "60.28% 0.2177 257.42",
        border: "88.21% 0.0409 273.32",
        primary: "38.17% 0.1302 265.22",
        surface: "100% 0 0",
        background: "95.17% 0.0058 264.53",
        foreground: "32.9% 0.0479 269.06",
        "muted-foreground": "61.897% 0.0115 261.77",
      },
      type: "light",
    },
    {
      name: "Mist",
      theme: {
        accent: "60% 0.18 260",
        border: "86% 0.02 260",
        primary: "36% 0.10 265",
        surface: "99% 0.001 265",
        background: "96% 0.002 265",
        foreground: "28% 0.05 260",
        "muted-foreground": "68% 0.01 260",
      },
      type: "light",
    },
    {
      name: "Earth",
      theme: {
        accent: "65% 0.11 120",
        border: "84% 0.02 120",
        primary: "42% 0.07 110",
        surface: "98% 0.001 110",
        background: "93% 0.002 110",
        foreground: "26% 0.045 105",
        "muted-foreground": "66% 0.01 110",
      },
      type: "light",
    },
    {
      name: "Coffee",
      theme: {
        accent: "70% 0.20 65",
        border: "85% 0.04 90",
        primary: "58% 0.15 80",
        surface: "99% 0.003 85",
        background: "95% 0.008 85",
        foreground: "28% 0.06 60",
        "muted-foreground": "62% 0.015 75",
      },
      type: "light",
    },
    {
      name: "Night",
      theme: {
        accent: "68% 0.16 270",
        border: "28% 0.02 270",
        primary: "78% 0.10 265",
        surface: "18% 0.002 265",
        background: "12% 0.001 265",
        foreground: "90% 0.04 270",
        "muted-foreground": "65% 0.01 260",
      },
      type: "dark",
    },
    {
      name: "Shade",
      theme: {
        accent: "64% 0.15 80",
        border: "32% 0.02 85",
        primary: "72% 0.09 75",
        surface: "20% 0.002 85",
        background: "14% 0.001 85",
        foreground: "88% 0.035 75",
        "muted-foreground": "68% 0.01 80",
      },
      type: "dark",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="px-4 py-3 border rounded-lg bg-surface mt-4 flex flex-col gap-2 w-80"
    >
      <h4 className="font-medium text-sm">ערכות מוכנות</h4>
      <div className="flex gap-2 child:cursor-pointer">
        <TooltipProvider>
          {presets.map((option) => (
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  onClick={() =>
                    setValue("theme", option.theme, { shouldDirty: true })
                  }
                  key={option.name}
                  style={{
                    backgroundColor:
                      option.type === "light"
                        ? `oklch(${option.theme.accent})`
                        : `oklch(${option.theme.surface})`,
                    borderColor: `oklch(${option.theme.accent})`,
                  }}
                  className="size-7 rounded-md border-2 border-red-600"
                ></div>
              </TooltipTrigger>
              <TooltipContent align="center">{option.name}</TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>
      <h4 className="font-medium text-sm mt-2">התאם אישית</h4>
      {Object.entries(theme).map(([label, color]) => {
        return (
          <ThemeRow
            key={label}
            label={label as keyof CustomStyles}
            color={color}
            setColor={(newColor) =>
              setValue(
                `theme.${label}` as
                  | "theme.foreground"
                  | "theme.primary"
                  | "theme.muted-foreground"
                  | "theme.accent"
                  | "theme.border"
                  | "theme.surface"
                  | "theme.background",
                newColor,
                { shouldDirty: true }
              )
            }
          />
        );
      })}
    </motion.div>
  );
}

function ThemeRow({
  label,
  color,
  setColor,
}: {
  label: keyof CustomStyles;
  color: string; // in OKLCH format
  setColor: (newColor: string) => void; // expects OKLCH
}) {
  const hexColor = oklchToHex(color); // convert for color picker

  return (
    <div className="flex justify-between child:flex child:gap-3 child:items-center child:relative">
      <p>{labelNames.find((item) => item.label === label)?.value || label}</p>
      <div>
        <Popover>
          <PopoverTrigger>
            <div
              style={{
                backgroundColor: hexColor,
              }}
              className={`${
                label === "surface" ? "border" : ""
              } size-7 rounded-md`}
            ></div>
          </PopoverTrigger>
          <PopoverContent>
            <ColorPicker
              value={hexColor}
              onChange={(hex) => {
                const newOklch = hexToOklch(hex);
                setColor(newOklch);
              }}
            />
          </PopoverContent>
        </Popover>
        <Input
          className="w-28"
          value={hexColor.slice(1).toUpperCase()}
          readOnly
        />
        <p className="absolute top-1/2 rtl:left-4 ltr:right-4 -translate-y-1/2 text-muted-foreground">
          #
        </p>
      </div>
    </div>
  );
}
