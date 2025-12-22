import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/hooks/useAuth";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "SEOJack Client Hub",
  description: "Your digital concierge for web design.",
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

import { Toaster } from "@/components/ui/sonner";

import { AppShell } from "@/components/layout/AppShell";

import { ImpersonationBanner } from "@/components/features/admin/ImpersonationBanner";
import { DevModeBanner } from "@/components/dev/DevModeBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans bg-background text-foreground antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <DevModeBanner />
            <ImpersonationBanner />
            <AppShell>
              {children}
            </AppShell>
            <Toaster position="bottom-right" />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
