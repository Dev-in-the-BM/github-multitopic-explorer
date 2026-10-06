import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Every color maps to an M3 role that `m3e-theme` generates from the
      // GitHub Primer seed color. They are hex strings, not channel triples,
      // so Tailwind opacity modifiers (`bg-primary/80`) cannot work on them.
      colors: {
        background: "var(--md-sys-color-surface)",
        foreground: "var(--md-sys-color-on-surface)",
        card: {
          DEFAULT: "var(--md-sys-color-surface-container)",
          foreground: "var(--md-sys-color-on-surface)",
        },
        popover: {
          DEFAULT: "var(--md-sys-color-surface-container-high)",
          foreground: "var(--md-sys-color-on-surface)",
        },
        primary: {
          DEFAULT: "var(--md-sys-color-primary)",
          foreground: "var(--md-sys-color-on-primary)",
          container: "var(--md-sys-color-primary-container)",
        },
        secondary: {
          DEFAULT: "var(--md-sys-color-secondary)",
          foreground: "var(--md-sys-color-on-secondary)",
          container: "var(--md-sys-color-secondary-container)",
        },
        tertiary: {
          DEFAULT: "var(--md-sys-color-tertiary)",
          foreground: "var(--md-sys-color-on-tertiary)",
          container: "var(--md-sys-color-tertiary-container)",
        },
        muted: {
          DEFAULT: "var(--md-sys-color-surface-container-high)",
          foreground: "var(--md-sys-color-on-surface-variant)",
        },
        accent: {
          DEFAULT: "var(--md-sys-color-secondary-container)",
          foreground: "var(--md-sys-color-on-secondary-container)",
        },
        destructive: {
          DEFAULT: "var(--md-sys-color-error)",
          foreground: "var(--md-sys-color-on-error)",
        },
        border: "var(--md-sys-color-outline-variant)",
        input: "var(--md-sys-color-outline)",
        ring: "var(--md-sys-color-primary)",
      },
      // M3 corner scale (tokens.md): 0/4/8/12/16/20/28/32/48/full
      borderRadius: {
        none: "0",
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "28px",
        "3xl": "32px",
        "4xl": "48px",
        full: "9999px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
