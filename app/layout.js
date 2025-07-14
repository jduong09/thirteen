import React, { ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Thirteen",
  description: "Web Version of Popular Card Game, Thirteen",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" disableTransitionOnChange>{children}</ThemeProvider>
        </body>
    </html>
  );
}


RootLayout.propTypes = {
  children: ReactNode
}