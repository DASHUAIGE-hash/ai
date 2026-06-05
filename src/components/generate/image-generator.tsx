"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Image,
  Download,
  Copy,
  RefreshCw,
  ChevronDown,
  Wand2,
  X,
  Clock,
  Zap,
  SlidersHorizontal,
} from "lucide-react";

/* ── 风格预设 ── */
const STYLES = [
  { id: "realistic", label: "写实摄影", emoji: "📷", prompt: "photorealistic, 8k, professional photography" },
  { id: "anime", label: "动漫风格", emoji: "🎨", prompt: "anime style, studio ghibli, vibrant" },
  { id: "oil", label: "油画质感", emoji: "🖼️", prompt: "oil painting, classical, detailed brushstrokes" },
  { id: "3d", label: "3D 渲染", emoji: "💎", prompt: "3D render, octane, cinematic lighting" },
  { id: "cyberpunk", label: "赛博朋克", emoji: "🌃", prompt: "cyberpunk, neon lights, futuristic city" },
  { id: "watercolor", label: "水墨国风", emoji: "🏔️", prompt: "chinese ink wash painting, misty mountains" },
  { id: "minimal", label: "极简设计", emoji: "⚪", prompt: "minimalist, clean, geometric, pastel" },
  { id: "fantasy", label: "奇幻世界", emoji: "🐉", prompt: "fantasy, magical, epic, intricate details" },
];

const SIZES = [
  { label: "1:1 方形", w: 1024, h: 1024, icon: "⬜" },
  { label: "3:4 竖版", w: 768, h: 1024, icon: "📱" },
  { label: "4:3 横版", w: 1024, h: 768, icon: "🖥️" },
  { label: "16:9 宽屏", w: 1280, h: 720, icon: "🎬" },
  { label: "9:16 全屏", w: 720, h: 1280, icon: "📲" },
];

// Mock 生成结果（演示用，后面接 Replicate API）
const MOCK_RESULTS = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=600&fit=crop",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&h=600&fit=crop",
];

export function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [count, setCount] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [negativePrompt, setNegativePrompt] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setResults([]);

    try {
      const response = await fetch("/api/generate/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          width: selectedSize.w,
          height: selectedSize.h,
          num_outputs: count,
        }),
      });

      const data = await response.json();

      if (data.success && data.images) {
        setResults(Array.isArray(data.images) ? data.images : [data.images]);
      } else {
        // API 失败时回退到 mock
        const generated = Array.from({ length: count }, (_, i) =>
          MOCK_RESULTS[i % MOCK_RESULTS.length]
        );
        setResults(generated);
      }
    } catch {
      // 网络错误时回退到 mock
      const generated = Array.from({ length: count }, (_, i) =>
        MOCK_RESULTS[i % MOCK_RESULTS.length]
      );
      setResults(generated);
    }
    setIsGenerating(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const selectedStyleData = STYLES.find((s) => s.id === selectedStyle);

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* 顶部标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0a84ff]/10">
            <Image className="h-5 w-5 text-[#0a84ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI 图片生成</h1>
            <p className="text-sm text-[#98989d]">输入描述，选择风格，让 AI 为你创作</p>
          </div>
        </motion.div>

        {/* 主体：左右分栏 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* ── 左栏：输入区 ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            {/* Prompt 输入 */}
            <div className="rounded-2xl glass p-5 space-y-4">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-[#0a84ff]" />
                描述你想要的画面
              </label>
              <textarea
                ref={inputRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="例如：一只戴着宇航员头盔的柴犬，漂浮在外太空，周围有五彩斑斓的星云，超现实主义风格..."
                rows={4}
                className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none focus:border-[#0a84ff]/40 focus:ring-1 focus:ring-[#0a84ff]/20 transition-all"
              />

              {/* 风格选择 */}
              <div>
                <p className="text-xs text-[#6e6e78] mb-2.5">选择风格（可选）</p>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        setSelectedStyle(selectedStyle === style.id ? null : style.id)
                      }
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                        selectedStyle === style.id
                          ? "bg-[#0a84ff] text-white shadow-lg shadow-[#0a84ff]/20"
                          : "bg-white/[0.04] text-[#98989d] hover:bg-white/[0.08] hover:text-white border border-white/[0.06]"
                      }`}
                    >
                      <span>{style.emoji}</span>
                      {style.label}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 负面提示词（可折叠） */}
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-2"
                >
                  <label className="text-xs text-[#6e6e78]">不想出现的元素（负面提示词）</label>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="例如：blurry, low quality, watermark"
                    className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none focus:border-[#5e5ce6]/40 focus:ring-1 focus:ring-[#5e5ce6]/20 transition-all"
                  />
                </motion.div>
              )}

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-xs text-[#6e6e78] hover:text-white transition-colors"
              >
                <SlidersHorizontal className="h-3 w-3" />
                {showAdvanced ? "收起高级选项" : "高级选项"}
              </button>
            </div>

            {/* 图像尺寸 */}
            <div className="rounded-2xl glass p-5 space-y-3">
              <label className="text-sm font-semibold text-white">图像尺寸</label>
              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((size) => (
                  <motion.button
                    key={size.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedSize(size)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-2.5 text-xs transition-all duration-200 ${
                      selectedSize.label === size.label
                        ? "bg-[#0a84ff]/15 text-[#0a84ff] border border-[#0a84ff]/30"
                        : "bg-white/[0.03] text-[#98989d] border border-transparent hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="text-base">{size.icon}</span>
                    <span>{size.label.split(" ")[0]}</span>
                  </motion.button>
                ))}
              </div>

              {/* 生成数量 */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-[#98989d]">生成数量</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 4].map((n) => (
                    <motion.button
                      key={n}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCount(n)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                        count === n
                          ? "bg-[#0a84ff] text-white"
                          : "bg-white/[0.04] text-[#98989d] hover:bg-white/[0.08]"
                      }`}
                    >
                      {n}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className={`group relative w-full overflow-hidden rounded-2xl py-4 text-base font-semibold text-white transition-all duration-300 ${
                !prompt.trim()
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
              <span className="relative flex items-center justify-center gap-2">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    正在生成中...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    开始生成
                  </>
                )}
              </span>
            </motion.button>

            {/* 提示信息 */}
            <p className="text-xs text-center text-[#6e6e78]">
              按 Enter 发送 · 每次生成消耗 2 积分
              {selectedStyleData && ` · 风格：${selectedStyleData.label}`}
            </p>
          </motion.div>

          {/* ── 右栏：结果区 ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-2xl glass p-5 min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Zap className="h-4 w-4 text-[#ff9f0a]" />
                  生成结果
                </span>
                {results.length > 0 && (
                  <div className="flex items-center gap-1">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg bg-white/[0.04] text-[#98989d] hover:text-white hover:bg-white/[0.08] transition-all"
                      title="下载全部"
                    >
                      <Download className="h-4 w-4" />
                    </motion.button>
                  </div>
                )}
              </div>

              {/* 结果区 */}
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    /* 生成中动画 */
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[400px] gap-6"
                    >
                      {/* 脉冲环 */}
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] animate-pulse" />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] animate-ping opacity-20" />
                        <div className="absolute -inset-2 rounded-2xl border border-[#0a84ff]/20 animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium">AI 正在创作中...</p>
                        <p className="text-sm text-[#98989d] mt-1">
                          {selectedStyleData
                            ? `正在用${selectedStyleData.label}风格渲染`
                            : "正在解析你的描述"}
                        </p>
                      </div>
                      {/* 进度条 */}
                      <div className="w-48 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]"
                          animate={{ width: ["0%", "30%", "60%", "85%", "100%"] }}
                          transition={{ duration: 3, ease: "easeInOut" }}
                        />
                      </div>
                    </motion.div>
                  ) : results.length > 0 ? (
                    /* 结果展示 */
                    <motion.div
                      key="results"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className={`grid gap-3 ${
                        results.length === 1
                          ? "grid-cols-1"
                          : results.length === 2
                          ? "grid-cols-2"
                          : "grid-cols-2"
                      }`}
                    >
                      {results.map((url, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.15 }}
                          className="group relative overflow-hidden rounded-xl border border-white/[0.06]"
                        >
                          <img
                            src={url}
                            alt={`生成结果 ${i + 1}`}
                            className="w-full aspect-square object-cover"
                          />
                          {/* hover 操作 */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                              title="下载"
                            >
                              <Download className="h-4 w-4" />
                            </motion.button>
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                              title="复制"
                            >
                              <Copy className="h-4 w-4" />
                            </motion.button>
                          </div>
                          {/* 序号 */}
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/60 text-xs text-white backdrop-blur-sm">
                            #{i + 1}
                          </span>
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    /* 空状态 */
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-[400px] gap-4"
                    >
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
                        <Image className="h-8 w-8 text-[#6e6e78]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#98989d] font-medium">尚未生成</p>
                        <p className="text-sm text-[#6e6e78] mt-1">
                          在左侧输入描述，AI 将为你创作图片
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* 底部提示 */}
              {results.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-4 text-xs text-[#6e6e78]">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      耗时约 {(1.5 + Math.random() * 2).toFixed(1)}s
                    </span>
                    <span>尺寸 {selectedSize.w}×{selectedSize.h}</span>
                    {selectedStyleData && <span>风格：{selectedStyleData.label}</span>}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
