import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 图片生成 — 豆角",
  description: "输入文字描述，AI 为你生成惊艳的高清图片。支持写实、动漫、油画等多种风格。",
};

export default function GenerateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
