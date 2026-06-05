"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function MascotDoujiao({
  size = 280,
  mood = "idle",
  className = "",
}: {
  size?: number;
  mood?: "idle" | "working" | "happy" | "sad";
  className?: string;
}) {
  const [blink, setBlink] = useState(false);

  // 眨眼循环
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  const scale = size / 280;

  // 不同心情的动画变体
  const moodAnimations = {
    idle: {
      y: [0, -10, 0],
      rotate: [0, 1, 0, -1, 0],
    },
    working: {
      y: [0, -4, 0],
      rotate: [0, 0, 0],
    },
    happy: {
      y: [0, -20, 0, -10, 0],
      rotate: [0, -3, 3, -3, 0],
    },
    sad: {
      y: [0, -3, 0],
      rotate: [0, 0, 0],
    },
  };

  const selectedMood = moodAnimations[mood];

  return (
    <motion.div
      className={`relative select-none ${className}`}
      style={{ width: size, height: size * 1.15 }}
      animate={selectedMood}
      transition={{
        duration: mood === "happy" ? 0.8 : 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <svg
        width={size}
        height={size * 1.15}
        viewBox="0 0 280 322"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* 3D 身体渐变 */}
          <radialGradient
            id="bodyGradient"
            cx="45%"
            cy="35%"
            r="55%"
            fx="38%"
            fy="30%"
          >
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="35%" stopColor="#4f46e5" />
            <stop offset="70%" stopColor="#3730a3" />
            <stop offset="100%" stopColor="#1e1b4b" />
          </radialGradient>

          {/* 身体高光 */}
          <radialGradient
            id="bodyHighlight"
            cx="35%"
            cy="25%"
            r="30%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          {/* 核心发光 */}
          <radialGradient
            id="coreGlow"
            cx="50%"
            cy="50%"
            r="50%"
          >
            <stop offset="0%" stopColor="#64d2ff" stopOpacity="1" />
            <stop offset="40%" stopColor="#0a84ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0a84ff" stopOpacity="0" />
          </radialGradient>

          {/* 核心内圈渐变 */}
          <radialGradient
            id="coreInner"
            cx="40%"
            cy="35%"
            r="50%"
          >
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>

          {/* 光环渐变 */}
          <linearGradient
            id="haloGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#64d2ff" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#64d2ff" stopOpacity="0.6" />
          </linearGradient>

          {/* 豆芽渐变 */}
          <linearGradient
            id="sproutGradient"
            x1="0%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>
        </defs>

        {/* ── 科技光环（背后）── */}
        <motion.ellipse
          cx="140"
          cy="155"
          rx="120"
          ry="30"
          fill="none"
          stroke="url(#haloGradient)"
          strokeWidth="1.5"
          strokeDasharray="8 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "140px 155px" }}
        />

        {/* ── 身体（豆形）── */}
        <ellipse
          cx="140"
          cy="168"
          rx="95"
          ry="110"
          fill="url(#bodyGradient)"
          stroke="rgba(99,102,241,0.3)"
          strokeWidth="1"
        />

        {/* 身体 3D 高光 */}
        <ellipse
          cx="140"
          cy="168"
          rx="95"
          ry="110"
          fill="url(#bodyHighlight)"
        />

        {/* 底部反光 */}
        <ellipse
          cx="140"
          cy="240"
          rx="55"
          ry="15"
          fill="rgba(100,210,255,0.06)"
        />

        {/* ── 豆芽（头顶）── */}
        <g transform="translate(140, 52)">
          {/* 茎 */}
          <motion.path
            d="M0 0 Q-3 -15 -8 -25"
            stroke="url(#sproutGradient)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            animate={{ rotate: [0, 2, 0, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* 左叶 */}
          <ellipse
            cx="-14"
            cy="-28"
            rx="10"
            ry="6"
            fill="#22c55e"
            transform="rotate(-30 -14 -28)"
          />
          {/* 右叶 */}
          <ellipse
            cx="0"
            cy="-30"
            rx="9"
            ry="5.5"
            fill="#16a34a"
            transform="rotate(20 0 -30)"
          />
        </g>

        {/* ── 眼睛 ── */}
        <g>
          {/* 左眼 */}
          <ellipse
            cx="110"
            cy="138"
            rx="18"
            ry={blink ? 2 : 20}
            fill="#1e1b4b"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.5"
          />
          {/* 左眼高光 */}
          {!blink && (
            <>
              <circle cx="116" cy="132" r="7" fill="white" opacity="0.9" />
              <circle cx="107" cy="142" r="3" fill="white" opacity="0.4" />
            </>
          )}

          {/* 右眼 */}
          <ellipse
            cx="170"
            cy="138"
            rx="18"
            ry={blink ? 2 : 20}
            fill="#1e1b4b"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.5"
          />
          {/* 右眼高光 */}
          {!blink && (
            <>
              <circle cx="176" cy="132" r="7" fill="white" opacity="0.9" />
              <circle cx="167" cy="142" r="3" fill="white" opacity="0.4" />
            </>
          )}
        </g>

        {/* ── 微笑 ── */}
        <motion.path
          d="M125 168 Q140 182 155 168"
          stroke="rgba(255,255,255,0.25)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          animate={mood === "happy" ? { d: "M120 165 Q140 188 160 165" } : {}}
        />

        {/* ── AI 核心（胸口）── */}
        <g transform="translate(140, 205)">
          {/* 外发光 */}
          <motion.circle
            cx="0"
            cy="0"
            r="24"
            fill="url(#coreGlow)"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* 核心主体 */}
          <circle cx="0" cy="0" r="10" fill="url(#coreInner)" />
          {/* 核心高光 */}
          <circle cx="-2" cy="-3" r="3.5" fill="white" opacity="0.6" />
          {/* 旋转环 */}
          <motion.circle
            cx="0"
            cy="0"
            r="14"
            fill="none"
            stroke="rgba(100,210,255,0.5)"
            strokeWidth="1"
            strokeDasharray="6 3"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </g>

        {/* ── 左手 ── */}
        <g transform="translate(42, 175)">
          <ellipse cx="0" cy="0" rx="22" ry="16" fill="url(#bodyGradient)" />
          <ellipse cx="0" cy="0" rx="22" ry="16" fill="url(#bodyHighlight)" opacity="0.5" />
          {/* 手指分界 */}
          <line x1="-8" y1="10" x2="-8" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          <line x1="0" y1="12" x2="0" y2="19" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          <line x1="8" y1="10" x2="8" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        </g>

        {/* ── 右手 ── */}
        <g transform="translate(238, 175)">
          <ellipse cx="0" cy="0" rx="22" ry="16" fill="url(#bodyGradient)" />
          <ellipse cx="0" cy="0" rx="22" ry="16" fill="url(#bodyHighlight)" opacity="0.5" />
          <line x1="-8" y1="10" x2="-8" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          <line x1="0" y1="12" x2="0" y2="19" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
          <line x1="8" y1="10" x2="8" y2="18" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
        </g>

        {/* ── 左脚 ── */}
        <ellipse cx="100" cy="290" rx="28" ry="18" fill="url(#bodyGradient)" />
        <ellipse cx="100" cy="290" rx="28" ry="18" fill="url(#bodyHighlight)" opacity="0.3" />

        {/* ── 右脚 ── */}
        <ellipse cx="180" cy="290" rx="28" ry="18" fill="url(#bodyGradient)" />
        <ellipse cx="180" cy="290" rx="28" ry="18" fill="url(#bodyHighlight)" opacity="0.3" />
      </svg>
    </motion.div>
  );
}
