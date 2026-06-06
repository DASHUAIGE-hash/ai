"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Image,
  Video,
  MessageSquare,
  FileText,
  Languages,
  Palette,
  Wand2,
  Music,
  Camera,
  type LucideIcon,
} from "lucide-react";

interface Tool {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
  color: string;
  bgColor: string;
  tag?: string;
}

const tools: Tool[] = [
  {
    icon: Image,
    title: "AI 图片生成",
    desc: "输入描述，一键生成高质量图片。支持写实、动漫、油画等多种风格",
    href: "/generate/image",
    color: "#0a84ff",
    bgColor: "rgba(10,132,255,0.08)",
    tag: "热门",
  },
  {
    icon: Video,
    title: "AI 视频生成",
    desc: "文字或图片转视频，让静态内容动起来，支持最长 10 秒视频",
    href: "/generate/video",
    color: "#5e5ce6",
    bgColor: "rgba(94,92,230,0.08)",
  },
  {
    icon: MessageSquare,
    title: "AI 智能对话",
    desc: "多模态 AI 助手，能聊天、能分析图片、能帮你写文章、能解答问题",
    href: "/tools/ai-chat",
    color: "#30d158",
    bgColor: "rgba(48,209,88,0.08)",
    tag: "演示",
  },
  {
    icon: Wand2,
    title: "图片智能编辑",
    desc: "一键抠图、背景替换、图片扩图、高清修复，无需 Photoshop",
    href: "/tools/image-editor",
    color: "#ff9f0a",
    bgColor: "rgba(255,159,10,0.08)",
  },
  {
    icon: FileText,
    title: "AI 文档助手",
    desc: "智能写作、文档摘要、PPT 大纲生成、文案优化，办公效率翻倍",
    href: "/tools/document",
    color: "#ff375f",
    bgColor: "rgba(255,55,95,0.08)",
    tag: "演示",
  },
  {
    icon: Languages,
    title: "智能翻译",
    desc: "多语言实时翻译，支持中英日韩等 20+ 语言，保留原文格式",
    href: "/tools/translate",
    color: "#64d2ff",
    bgColor: "rgba(100,210,255,0.08)",
  },
  {
    icon: Palette,
    title: "风格迁移",
    desc: "将你的照片变成任何艺术风格：梵高、莫奈、赛博朋克、水墨画",
    href: "/tools/style-transfer",
    color: "#bf5af2",
    bgColor: "rgba(191,90,242,0.08)",
  },
  {
    icon: Music,
    title: "AI 音乐生成",
    desc: "根据场景和情绪，自动生成背景音乐和音效，视频创作更完整",
    href: "/tools/music-gen",
    color: "#ff6482",
    bgColor: "rgba(255,100,130,0.08)",
    tag: "演示",
  },
  {
    icon: Camera,
    title: "AI 写真生成",
    desc: "上传几张自拍，生成专业级写真照片，多种风格模板随心切换",
    href: "/tools/ai-portrait",
    color: "#40c8e0",
    bgColor: "rgba(64,200,224,0.08)",
  },
];

const container: any = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item: any = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export function ToolsGrid() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-50" />

      {/* 背景光晕 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5e5ce6] opacity-[0.03] blur-[150px] rounded-full" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-[#64d2ff]">
            <Wand2 className="h-3.5 w-3.5" />
            全能 AI 工具矩阵
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="text-white">不止于生成，</span>
            <span className="text-gradient">一站满足</span>
            <span className="text-white">所有创作需求</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-base text-[#98989d]">
            从图片视频到文档翻译，从智能对话到音乐生成，豆角正在构建完整的 AI 创作生态
          </p>
        </motion.div>

        {/* 工具网格 */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {tools.map((tool) => (
            <Link key={tool.title} href={tool.href}>
              <motion.div
                variants={item}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12] cursor-pointer"
              >
                {/* 图标 */}
                <div
                  className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-300"
                  style={{ background: tool.bgColor, color: tool.color }}
                >
                  <tool.icon className="h-6 w-6" />
                </div>

                {/* 标签 */}
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-semibold text-white">{tool.title}</h3>
                  {tool.tag && (
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        tool.tag === "热门"
                          ? "bg-[#ff375f]/15 text-[#ff375f]"
                          : "bg-white/[0.06] text-[#6e6e78]"
                      }`}
                    >
                      {tool.tag}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-[#98989d]">{tool.desc}</p>

                {/* hover 边框发光 */}
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                  style={{
                    border: `1px solid ${tool.color}20`,
                    boxShadow: `inset 0 0 30px ${tool.color}05`,
                  }}
                />
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
