import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindGym — Train Your Memory",
  description:
    "MindGym is a daily memory practice app. Memorize word grids, recall them perfectly, and track your progress over time.",
  openGraph: {
    title: "MindGym — Train Your Memory",
    description:
      "A daily memory practice app to sharpen your focus and strengthen your recall.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>{children}</body>
    </html>
  );
}
