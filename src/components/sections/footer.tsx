"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Sparkles, Heart, Globe, MessageCircle } from "lucide-react";

const footerLinks = {
  产品: [
    { label: "图片生成", href: "/generate/image" },
    { label: "视频生成", href: "/generate/video" },
    { label: "作品画廊", href: "/gallery" },
    { label: "风格市场", href: "#" },
  ],
  支持: [
    { label: "帮助中心", href: "#" },
    { label: "使用教程", href: "#" },
    { label: "Prompt 指南", href: "#" },
    { label: "常见问题", href: "#" },
  ],
  关于: [
    { label: "关于豆角", href: "#" },
    { label: "更新日志", href: "#" },
    { label: "加入我们", href: "#" },
    { label: "联系反馈", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-16">
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 rounded-full glass px-6 py-3">
            <span className="text-2xl">🫘</span>
            <span className="text-xl font-bold text-white">豆角</span>
            <span className="text-sm text-[#98989d]">· AI 创作平台</span>
          </div>
          <p className="mt-6 max-w-md mx-auto text-sm text-[#6e6e78]">
            让 AI 成为你的创作伙伴。我们相信，每个人都是创作者，只是还没找到趁手的工具。
          </p>

          {/* CTA Button */}
          <motion.div className="mt-8" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/generate/image"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-8 py-3.5 text-base font-medium text-white"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
              <span className="relative flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                免费开始创作
              </span>
            </Link>
          </motion.div>
        </motion.div>

        {/* 链接 */}
        <div className="grid gap-10 sm:grid-cols-4">
          <div className="sm:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🫘</span>
              <span className="font-bold text-white">豆角</span>
            </div>
            <p className="text-sm text-[#6e6e78] leading-relaxed">
              AI 驱动的智能创作平台。
              <br />
              让创意即刻呈现。
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="text-[#6e6e78] hover:text-white transition-colors">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="text-[#6e6e78] hover:text-white transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6e6e78] hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部 */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#6e6e78]">
            © 2026 豆角 · 保留所有权利
          </p>
          <p className="text-xs text-[#6e6e78] flex items-center gap-1">
            用 <Heart className="h-3 w-3 text-[#ff375f]" /> 打造 · 为创作者而生
          </p>
        </div>
      </div>
    </footer>
  );
}
