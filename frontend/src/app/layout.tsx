import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Quorum — Fraud Intelligence Platform",
  description: "Security simulation and fraud detection dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${font.variable} h-full`}>
      <body
        className="min-h-full antialiased"
        style={{ fontFamily: "var(--font-primary), sans-serif" }}
      >
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
