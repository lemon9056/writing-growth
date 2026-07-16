import type { Metadata } from "next";
import { Gowun_Batang, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 제목에 쓰는 손글씨 느낌의 세리프 폰트
const gowunBatang = Gowun_Batang({
  variable: "--font-gowun-batang",
  subsets: ["latin"],
  weight: "700",
});

// 본문에 쓰는 기본 한글 폰트
const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://writing-growth.vercel.app"),
  title: "마음의 초고",
  description: "완벽하지 않아도 괜찮은, 매일 짧게 써보는 나만의 초고",
  openGraph: {
    title: "마음의 초고",
    description: "완벽하지 않아도 괜찮은, 매일 짧게 써보는 나만의 초고",
    type: "website",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${gowunBatang.variable} ${notoSansKR.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
