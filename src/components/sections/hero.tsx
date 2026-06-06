"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowDown, Sparkles, Image, Video } from "lucide-react";
import { MascotDoujiao } from "@/components/mascot/doujiao";
import Link from "next/link";

const stagger: any = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const fadeUp: any = {
  hidden: { y: 40, opacity: 0, filter: "blur(8px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const highlights = [
  {
    icon: Image,
    title: "AI 图片生成",
    desc: "输入文字，瞬间生成高清图片。支持多种风格，从写实到动漫，随心所欲。",
  },
  {
    icon: Video,
    title: "AI 视频生成",
    desc: "让静态画面动起来。文字转视频、图片转视频，创作从未如此简单。",
  },
  {
    icon: Sparkles,
    title: "智能优化",
    desc: "AI 帮你优化提示词，不懂怎么写 Prompt 也能生成惊艳作品。",
  },
];

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mascotY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const mascotOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden"
    >
      {/* 网格背景 */}
      <div className="absolute inset-0 grid-bg" />

      {/* 粒子遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

      {/* 顶部光晕 */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#5e5ce6] opacity-[0.06] blur-[120px] rounded-full pointer-events-none" />

      {/* ── 主内容区 ── */}
      <div className="relative z-10 flex justify-center min-h-screen">
        <div className="flex flex-col items-center justify-center px-6"
          style={{ width: "min(100%, 80rem)" }}
        >
          <motion.div
            style={{ y: contentY }}
            className="flex flex-col items-center gap-12 pt-32 pb-16 lg:flex-row lg:gap-20 lg:items-center"
          >
            {/* 左侧：文案 */}
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="visible"
              className="flex flex-col items-center text-center lg:items-start lg:text-left lg:flex-1"
            >
              <motion.div
                variants={fadeUp}
                className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-[#64d2ff]"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#64d2ff] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#64d2ff]" />
                </span>
                AI 驱动的智能创作平台
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="mt-6 text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl"
              >
                <span className="text-white">让创意</span>
                <br />
                <span className="text-gradient">即刻呈现</span>
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="mt-6 max-w-md text-lg leading-relaxed text-[#98989d]"
              >
                豆角是你的 AI 创作伙伴。只需输入一句话，就能生成惊艳的图片与视频。
                无需专业技能，让你的想象力自由驰骋。
              </motion.p>

              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <Link href="/generate/image">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group relative overflow-hidden rounded-full px-8 py-3.5 text-base font-medium text-white"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
                    <span className="relative flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      开始创作
                    </span>
                  </motion.button>
                </Link>

                <Link href="/gallery">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-full glass-elevated px-8 py-3.5 text-base font-medium text-[#f5f5f7] hover:border-white/15 transition-all duration-300"
                  >
                    探索作品
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeUp}
                className="mt-10 flex gap-8 text-sm text-[#6e6e78]"
              >
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">50+</span>
                  风格模型
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">10s</span>
                  快速出图
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <span className="block text-2xl font-bold text-white">∞</span>
                  创意无限
                </div>
              </motion.div>
            </motion.div>

            {/* 右侧：吉祥物 */}
            <motion.div
              style={{ y: mascotY, opacity: mascotOpacity }}
              className="relative flex items-center justify-center lg:flex-1"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#5e5ce6] opacity-[0.08] blur-[100px] rounded-full" />
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              >
                <MascotDoujiao size={280} mood="idle" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* ── 功能亮点卡片 ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.7, ease: "easeOut" }}
            className="grid grid-cols-1 gap-4 pb-20 sm:grid-cols-3"
            style={{ maxWidth: "64rem" }}
          >
            {highlights.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative overflow-hidden rounded-2xl glass p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a84ff]/10 text-[#0a84ff] group-hover:bg-[#0a84ff]/15 transition-colors">
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#98989d]">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* ── 向下滚动指示 ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="flex flex-col items-center gap-2 pb-8"
          >
            <span className="text-xs text-[#6e6e78]">向下探索</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="h-4 w-4 text-[#6e6e78]" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
