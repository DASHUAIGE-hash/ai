"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/generate/image", label: "图片生成" },
  { href: "/generate/video", label: "视频生成" },
  { href: "/gallery", label: "作品画廊" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b border-white/5 py-3"
          : "bg-transparent py-5"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="text-2xl">🫘</span>
          <span className="text-xl font-bold tracking-tight text-white group-hover:text-gradient transition-all duration-300">
            豆角
          </span>
        </Link>

        {/* 导航链接 */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.href}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4, ease: "easeOut" }}
            >
              <Link
                href={link.href}
                className="relative px-4 py-2 text-sm text-[#98989d] hover:text-white transition-colors duration-300 rounded-full hover:bg-white/[0.04]"
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <Link href="/generate/image">
          <motion.button
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative overflow-hidden rounded-full px-5 py-2 text-sm font-medium text-white"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]" />
            <span className="relative">开始创作</span>
          </motion.button>
        </Link>
      </nav>
    </motion.header>
  );
}
