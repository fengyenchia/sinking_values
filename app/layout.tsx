import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import BgMusic from "@/components/bgMusic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sinking Values",
  description: "一艘在迷霧中逐漸下沉的木船，一場關於犧牲與抉擇的航行。面對擺渡人的拷問，你願意拋下什麼？直面內心深處的抉擇，打撈出屬於你的靈魂質地與核心價值觀。",
  icons: {
    icon: "/icon.png",
  },
  keywords: ["心理測驗", "Sinking Values", "AI心理測驗", "靈魂特質", "價值觀測驗"],
  authors: [{ name: "Yen-Chia Feng" }],
  openGraph: {
    title: "Sinking Values ｜ 一場關於靈魂承載量的心理測驗",
    description: "海面下的虛無正在腐蝕船底。在抵達彼岸之前，你願意拋棄什麼？測出你的靈魂質地。",
    url: "https://sinking-values.vercel.app/",
    siteName: "Sinking Values",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Sinking Values 沉沒價值",
      },
    ],
    locale: "zh_TW",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
      <body className="min-h-full flex flex-col bg-background">
        <BgMusic />
        {children}
      </body>
    </html>
  );
}
