import type { Metadata } from "next";
import { Amatic_SC } from "next/font/google";
import "./globals.css";

const amatic = Amatic_SC({
  variable: "--font-amatic",
  subsets: ["hebrew", "latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dry With Colors | קטלוג מוצרים",
  description: "קטלוג סידורי פרחים יבשים, כלי גבס מעוצבים בעבודת יד",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${amatic.variable} antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
