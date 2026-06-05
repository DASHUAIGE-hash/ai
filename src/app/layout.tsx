import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";

export const metadata: Metadata = {
  title: "豆角 — AI 智能创作平台",
  description:
    "豆角是你的 AI 创作伙伴。AI 图片生成、AI 视频生成，一键创作，让创意即刻呈现。",
  keywords: ["AI图片生成", "AI视频生成", "豆角", "AI创作", "人工智能"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-[#f5f5f7]">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
