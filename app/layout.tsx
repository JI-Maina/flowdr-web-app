import { Toaster } from "sonner";
import type { Metadata } from "next";
import { Acme, Space_Mono } from "next/font/google";

import "./globals.css";
import ReactQueryProvider from "@/providers/react-query-provider";

const acmeSans = Acme({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: "400",
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Flowdr",
  description: "Your business in flow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${acmeSans.variable} ${spaceMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          {children}

          <Toaster richColors />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
