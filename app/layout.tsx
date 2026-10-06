import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from '@vercel/analytics/next';

import { M3eThemeProvider } from '@/components/m3e-theme-provider';

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GitHub Multi-Topics Explorer",
  description: "Create and Find Github Repo with  Multiple Topics in Common",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0d1117" },
  ],
};

/**
 * `m3e-theme` can only publish its color scheme once the custom element has
 * upgraded on the client, which would leave a white flash for anyone who
 * chose dark mode. This runs before first paint and applies the same stored
 * preference the provider will read: the UA-level `color-scheme` plus the
 * `data-scheme` attribute the pinned GitHub palette keys off, so the right
 * roles win from the first frame instead of flashing the generated scheme.
 */
const preHydrationThemeScript = `
(function () {
  try {
    var stored = localStorage.getItem('colorPreference');
    var scheme = 'light';
    if (stored === 'light' || stored === 'dark') {
      scheme = stored;
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      scheme = 'dark';
    }
    document.documentElement.dataset.scheme = scheme;
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.style.colorScheme = stored;
    } else if (scheme === 'dark') {
      document.documentElement.style.colorScheme = 'dark';
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: preHydrationThemeScript }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <M3eThemeProvider>{children}</M3eThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}