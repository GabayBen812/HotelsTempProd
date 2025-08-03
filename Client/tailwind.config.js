const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      zIndex: {
        chat: "9999",
        "above-all": "9998",
      },
      colors: {
        background: {
          DEFAULT: "oklch(var(--background) / <alpha-value>)",
        },
        foreground: "oklch(var(--foreground) / <alpha-value>)",
        surface: "oklch(var(--surface) / <alpha-value>)",
        text: "oklch(var(--text) / <alpha-value>)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "var(--primary-foreground)",
          light: "var(--primary-light)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "oklch(var(--border) / <alpha-value>)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--surface) / <alpha-value>)",
          foreground: "oklch(var(--foreground) / <alpha-value>)",
          primary: "oklch(var(--primary) / <alpha-value>)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "oklch(var(--accent) / <alpha-value>)",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "oklch(var(--border) / <alpha-value>)",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      animation: {
        aurora: "aurora 60s linear infinite",
        bounceAndPulse: "bounceAndPulse 1.4s infinite",
      },
      keyframes: {
        bounceAndPulse: {
          "0%, 60%, 100%": {
            transform: "translateY(0) scale(1)",
            opacity: "0.7",
          },
          "30%": {
            transform: "translateY(-4px) scale(1.1)",
            opacity: "1",
          },
        },
        aurora: {
          from: {
            backgroundPosition: "50% 50%, 50% 50%",
          },
          to: {
            backgroundPosition: "350% 50%, 350% 50%",
          },
        },
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    function ({ addVariant }) {
      addVariant("child", "& > *");
      addVariant("child-hover", "& > *:hover");
      addVariant("rtl", '[dir="rtl"] &');
      addVariant("ltr", '[dir="ltr"] &');
    },
    addVariablesForColors,
  ],
};
function addVariablesForColors({ addBase, theme }) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
