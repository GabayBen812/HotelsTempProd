import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pipette } from "lucide-react";
import { Input } from "./Input";
import { Button } from "./button";

// Types
interface RGB {
  r: number;
  g: number;
  b: number;
}

interface HSV {
  h: number;
  s: number;
  v: number;
}

interface ColorPickerProps {
  value?: string;
  onChange?: (color: string) => void;
  className?: string;
}

type ColorFormat = "hex" | "rgb";
type RGBComponent = "r" | "g" | "b";

// Color conversion utilities
const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const rgbToHex = (r: number, g: number, b: number): string => {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(Math.max(0, Math.min(255, x))).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
};

const rgbToHsv = (r: number, g: number, b: number): HSV => {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const diff = max - min;
  const v = max;
  const s = max === 0 ? 0 : diff / max;

  let h = 0;
  if (diff !== 0) {
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / diff + 2;
        break;
      case b:
        h = (r - g) / diff + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
};

const hsvToRgb = (h: number, s: number, v: number): RGB => {
  h /= 360;
  s /= 100;
  v /= 100;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r: number, g: number, b: number;
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
    default:
      r = v;
      g = t;
      b = p;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
};

export default function ColorPicker({
  value = "#000000",
  onChange,
  className = "",
}: ColorPickerProps) {
  const [color, setColor] = useState<string>(value);
  const [inputValue, setInputValue] = useState<string>(value);
  const [format, setFormat] = useState<ColorFormat>("hex");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isHueDragging, setIsHueDragging] = useState<boolean>(false);
  const colorAreaRef = useRef<HTMLDivElement>(null);
  const hueBarRef = useRef<HTMLDivElement>(null);

  const rgb: RGB = hexToRgb(color) || { r: 0, g: 0, b: 0 };
  const hsv: HSV = rgbToHsv(rgb.r, rgb.g, rgb.b);

  useEffect(() => {
    if (value !== color) {
      setColor(value);
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (format === "hex") {
      setInputValue(color);
    }
  }, [color, format]);

  const updateColor = useCallback(
    (newColor: string) => {
      setColor(newColor);
      onChange?.(newColor);
    },
    [onChange]
  );

  const handleColorAreaMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!colorAreaRef.current) return;
      const rect = colorAreaRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      const newS = x * 100;
      const newV = (1 - y) * 100;
      const newRgb = hsvToRgb(hsv.h, newS, newV);
      updateColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    },
    [hsv.h, updateColor]
  );

  const handleHueMove = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!hueBarRef.current) return;
      const rect = hueBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newH = x * 360;
      const newRgb = hsvToRgb(newH, hsv.s, hsv.v);
      updateColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
    },
    [hsv.s, hsv.v, updateColor]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) handleColorAreaMove(e);
      if (isHueDragging) handleHueMove(e);
    };
    const handleMouseUp = () => {
      setIsDragging(false);
      setIsHueDragging(false);
    };
    if (isDragging || isHueDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isHueDragging, handleColorAreaMove, handleHueMove]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let hex = e.target.value;
    if (!hex.startsWith("#")) hex = "#" + hex;
    setInputValue(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      updateColor(hex);
    }
  };

  const handleRgbChange = (component: RGBComponent, value: string) => {
    const numValue = parseInt(value) || 0;
    const newRgb = { ...rgb, [component]: numValue };
    updateColor(rgbToHex(newRgb.r, newRgb.g, newRgb.b));
  };

  // RGB slider
  const inputRefs = useRef<Record<RGBComponent, HTMLInputElement | null>>({
    r: null,
    g: null,
    b: null,
  });

  const [hoveredComponent, setHoveredComponent] = useState<RGBComponent | null>(
    null
  );
  const [isEdgeHovering, setIsEdgeHovering] = useState(false);

  const isNearEdge = (e: React.MouseEvent<HTMLInputElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const edgeMargin = 8; // pixels from left/right considered "edge"
    const x = e.clientX - rect.left;
    return x <= edgeMargin || x >= rect.width - edgeMargin;
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLInputElement>,
    component: RGBComponent
  ) => {
    const nearEdge = isNearEdge(e);
    setHoveredComponent(component);
    setIsEdgeHovering(nearEdge);
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLInputElement>,
    component: RGBComponent
  ) => {
    if (!isNearEdge(e)) return;
    e.preventDefault();

    let startX = e.clientX;
    const startValue = rgb[component];

    const onMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newValue = Math.min(255, Math.max(0, startValue + delta));
      handleRgbChange(component, String(newValue));
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  // Eye dropper
  const handleEyeDropper = async () => {
    try {
      if ("EyeDropper" in window) {
        // @ts-ignore
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        updateColor(result.sRGBHex);
      }
    } catch (error) {
      console.error("EyeDropper failed:", error);
    }
  };

  const colorPosition = {
    x: (hsv.s / 100) * 100,
    y: (1 - hsv.v / 100) * 100,
  };
  const huePosition = (hsv.h / 360) * 100;
  const hueColor = hsvToRgb(hsv.h, 100, 100);

  return (
    <div className={`w-full max-w-sm space-y-4 ${className}`}>
      {/* Color Area */}
      <div
        ref={colorAreaRef}
        className="relative w-full h-48 rounded-lg cursor-crosshair overflow-hidden"
        style={{
          background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, rgb(${hueColor.r}, ${hueColor.g}, ${hueColor.b}))`,
        }}
        onMouseDown={(e) => {
          setIsDragging(true);
          handleColorAreaMove(e);
        }}
      >
        <div
          className="absolute w-4 h-4 rounded-full border-2 border-surface shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
          style={{
            left: `${colorPosition.x}%`,
            top: `${colorPosition.y}%`,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)",
          }}
        />
      </div>

      {/* Hue Bar + EyeDropper */}
      <div className="flex items-center gap-2">
        <div
          ref={hueBarRef}
          className="relative flex-1 h-4 rounded-full cursor-pointer overflow-hidden"
          style={{
            background:
              "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
          }}
          onMouseDown={(e) => {
            setIsHueDragging(true);
            handleHueMove(e);
          }}
        >
          <div
            className="absolute w-4 h-4 rounded-full border-2 shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-1/2 bg-surface"
            style={{
              left: `${huePosition}%`,
              top: "50%",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.1)",
            }}
          />
        </div>

        {"EyeDropper" in window && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleEyeDropper}
            className="px-2"
          >
            <Pipette size={16} />
          </Button>
        )}
      </div>

      {/* Format Selector + Input */}
      <div className="flex items-end gap-2 w-full">
        <Select
          value={format}
          onValueChange={(value: ColorFormat) => setFormat(value)}
        >
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hex">HEX</SelectItem>
            <SelectItem value="rgb">RGB</SelectItem>
          </SelectContent>
        </Select>

        {format === "hex" ? (
          <div className="relative">
            <span className="text-muted-foreground font-mono select-none absolute left-4 top-1/2 -translate-y-1/2">
              #
            </span>
            <Input
              type="text"
              value={inputValue.replace(/^#/, "")}
              onChange={(e) =>
                handleHexChange({
                  ...e,
                  target: { ...e.target, value: "#" + e.target.value },
                })
              }
              className="bg-transparent outline-none ml-1 text-xs w-full focus-visible:ring-1 focus-visible:outline-none ltr:text-right h-8"
              placeholder="000000"
              maxLength={6}
            />
          </div>
        ) : (
          <div className="flex gap-2 w-full h-8">
            {(["r", "g", "b"] as RGBComponent[]).map((comp) => (
              <div className="flex-1 min-w-0 h-8" key={comp}>
                <Input
                  ref={(el) => (inputRefs.current[comp] = el)}
                  type="number"
                  min={0}
                  max={255}
                  value={rgb[comp]}
                  onChange={(e) => handleRgbChange(comp, e.target.value)}
                  onMouseMove={(e) => handleMouseMove(e, comp)}
                  onMouseLeave={() => {
                    setHoveredComponent(null);
                    setIsEdgeHovering(false);
                  }}
                  dir="ltr"
                  onMouseDown={(e) => handleMouseDown(e, comp)}
                  className={`ltr:text-center w-full h-8 text-xs p-0 rtl:text-center appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${
                    hoveredComponent === comp && isEdgeHovering
                      ? "cursor-ew-resize"
                      : ""
                  }`}
                  placeholder={comp.toUpperCase()}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
