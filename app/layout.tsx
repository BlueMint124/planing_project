import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "여행메이트",
  description: "동선과 예산을 고려하는 AI 단체 여행 플래너",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
