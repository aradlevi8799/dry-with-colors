import type { Metadata } from "next";
import { Varela_Round } from "next/font/google";
import "./globals.css";

const varela = Varela_Round({
  variable: "--font-varela",
  subsets: ["hebrew", "latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dry With Colors | קטלוג מוצרים",
  description: "קטלוג סידורי פרחים יבשים, כלי גבס מעוצבים בעבודת יד",
  openGraph: {
    title: "Dry With Colors | קטלוג מוצרים",
    description: "סידורי פרחים יבשים, כלי גבס מעוצבים בעבודת יד",
    images: [{ url: "/og-image.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dry With Colors | קטלוג מוצרים",
    description: "סידורי פרחים יבשים, כלי גבס מעוצבים בעבודת יד",
    images: ["/og-image.jpg"],
  },
  other: {
    "theme-color": "#FFFFFF",
    "viewport": "width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=5, viewport-fit=cover",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${varela.variable} antialiased bg-white`}>
        {children}
      </body>
    </html>
  );
}
