"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Video,
  Download,
  Upload,
  ImagePlus,
  Play,
  Pause,
  Clock,
  Zap,
  Film,
  Camera,
  PartyPopper,
  RefreshCw,
  Music,
} from "lucide-react";

/* ── 视频风格预设 ── */
const VIDEO_STYLES = [
  { id: "cinematic", label: "电影质感", emoji: "🎬", desc: "大片级光影" },
  { id: "anime", label: "动漫风格", emoji: "🎨", desc: "二次元动画" },
  { id: "realistic", label: "写实风格", emoji: "📹", desc: "真实世界感" },
  { id: "fantasy", label: "奇幻特效", emoji: "✨", desc: "魔法般视觉" },
  { id: "3d", label: "3D 动画", emoji: "💎", desc: "三维渲染" },
  { id: "vintage", label: "复古胶片", emoji: "📽️", desc: "怀旧质感" },
];

const DURATIONS = [
  { seconds: 3, label: "3 秒", desc: "快速预览" },
  { seconds: 5, label: "5 秒", desc: "短视频" },
  { seconds: 10, label: "10 秒", desc: "完整片段" },
];

/* ── 生成阶段 ── */
const GENERATION_STAGES = [
  "解析场景描述...",
  "构建关键帧...",
  "生成中间帧...",
  "优化画面质量...",
  "渲染输出中...",
];

// Mock 视频（演示用）
const MOCK_VIDEO = "https://www.w3schools.com/html/mov_bbb.mp4";

export function VideoGenerator() {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [prompt, setPrompt] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [duration, setDuration] = useState(DURATIONS[1]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generationStage, setGenerationStage] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() && mode === "text") return;
    if (!referenceImage && mode === "image") return;
    setIsGenerating(true);
    setResult(null);
    setGenerationStage(0);

    // 模拟分阶段（保留视觉反馈）
    const stageInterval = setInterval(() => {
      setGenerationStage(prev => Math.min(prev + 1, GENERATION_STAGES.length));
    }, 1200);

    try {
      const response = await fetch("/api/generate/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt || "a beautiful scene",
          duration: duration.seconds,
          style: selectedStyle,
        }),
      });

      const data = await response.json();
      clearInterval(stageInterval);

      if (data.success && data.video) {
        setResult(Array.isArray(data.video) ? data.video[0] : data.video);
      } else {
        setResult(MOCK_VIDEO);
      }
    } catch {
      clearInterval(stageInterval);
      setResult(MOCK_VIDEO);
    }
    setGenerationStage(GENERATION_STAGES.length);
    setIsGenerating(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setReferenceImage(url);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const selectedStyleData = VIDEO_STYLES.find((s) => s.id === selectedStyle);

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* 顶部标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5e5ce6]/10">
            <Video className="h-5 w-5 text-[#5e5ce6]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI 视频生成</h1>
            <p className="text-sm text-[#98989d]">文字或图片转视频，让创意动起来</p>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ── 左栏：输入区 ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-5"
          >
            {/* 模式切换 */}
            <div className="rounded-2xl glass p-1.5 flex gap-1">
              <button
                onClick={() => setMode("text")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                  mode === "text"
                    ? "bg-[#5e5ce6] text-white shadow-lg shadow-[#5e5ce6]/20"
                    : "text-[#98989d] hover:text-white"
                }`}
              >
                <Film className="h-4 w-4" />
                文字转视频
              </button>
              <button
                onClick={() => setMode("image")}
                className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all duration-200 ${
                  mode === "image"
                    ? "bg-[#5e5ce6] text-white shadow-lg shadow-[#5e5ce6]/20"
                    : "text-[#98989d] hover:text-white"
                }`}
              >
                <Camera className="h-4 w-4" />
                图片转视频
              </button>
            </div>

            {/* Prompt / 图片上传 */}
            <div className="rounded-2xl glass p-5 space-y-4">
              {mode === "text" ? (
                <>
                  <label className="text-sm font-semibold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-[#5e5ce6]" />
                    描述你想生成的视频
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="例如：一只猫在樱花树下漫步，微风拂过，花瓣飘落，温暖柔和的自然光线，电影质感..."
                    rows={4}
                    className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none focus:border-[#5e5ce6]/40 focus:ring-1 focus:ring-[#5e5ce6]/20 transition-all"
                  />
                </>
              ) : (
                <>
                  <label className="text-sm font-semibold text-white flex items-center gap-2">
                    <ImagePlus className="h-4 w-4 text-[#5e5ce6]" />
                    上传参考图片
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
                      referenceImage
                        ? "border-[#5e5ce6]/30 p-2"
                        : "border-white/[0.08] p-10 hover:border-white/[0.15]"
                    }`}
                  >
                    {referenceImage ? (
                      <div className="relative group">
                        <img
                          src={referenceImage}
                          alt="参考图"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 rounded-lg bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="text-sm text-white">点击更换图片</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/[0.04]">
                          <Upload className="h-6 w-6 text-[#6e6e78]" />
                        </div>
                        <p className="text-sm text-[#98989d]">点击上传或拖拽图片</p>
                        <p className="text-xs text-[#6e6e78]">支持 JPG/PNG，最大 10MB</p>
                      </div>
                    )}
                  </div>

                  {/* 图片转视频时也支持 prompt 描述动作 */}
                  <div className="pt-2">
                    <label className="text-xs text-[#6e6e78] mb-2 block">
                      描述画面运动（可选）
                    </label>
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="例如：镜头缓慢拉近，人物转头微笑..."
                      className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none focus:border-[#5e5ce6]/40 transition-all"
                    />
                  </div>
                </>
              )}
            </div>

            {/* 风格选择 */}
            <div className="rounded-2xl glass p-5 space-y-3">
              <label className="text-sm font-semibold text-white">视频风格</label>
              <div className="grid grid-cols-3 gap-2">
                {VIDEO_STYLES.map((style) => (
                  <motion.button
                    key={style.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() =>
                      setSelectedStyle(selectedStyle === style.id ? null : style.id)
                    }
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 text-xs transition-all duration-200 ${
                      selectedStyle === style.id
                        ? "bg-[#5e5ce6]/15 text-[#5e5ce6] border border-[#5e5ce6]/30"
                        : "bg-white/[0.03] text-[#98989d] border border-transparent hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="text-lg">{style.emoji}</span>
                    <span className="font-medium">{style.label}</span>
                    <span className="text-[10px] text-[#6e6e78]">{style.desc}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 时长选择 */}
            <div className="rounded-2xl glass p-5 space-y-3">
              <label className="text-sm font-semibold text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#ff9f0a]" />
                视频时长
              </label>
              <div className="flex gap-2">
                {DURATIONS.map((d) => (
                  <motion.button
                    key={d.seconds}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setDuration(d)}
                    className={`flex-1 rounded-xl p-3 text-center transition-all duration-200 ${
                      duration.seconds === d.seconds
                        ? "bg-[#5e5ce6]/15 text-white border border-[#5e5ce6]/30"
                        : "bg-white/[0.03] text-[#98989d] border border-transparent hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className="text-lg font-bold">{d.label}</div>
                    <div className="text-[10px] text-[#6e6e78] mt-0.5">{d.desc}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 生成按钮 */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              disabled={
                isGenerating ||
                (mode === "text" && !prompt.trim()) ||
                (mode === "image" && !referenceImage)
              }
              className={`group relative w-full overflow-hidden rounded-2xl py-4 text-base font-semibold text-white transition-all duration-300 ${
                (mode === "text" && !prompt.trim()) || (mode === "image" && !referenceImage)
                  ? "opacity-40 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#5e5ce6] to-[#ff375f]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#5e5ce6] to-[#ff375f] opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />
              <span className="relative flex items-center justify-center gap-2">
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    正在生成视频...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    开始生成视频
                  </>
                )}
              </span>
            </motion.button>

            <p className="text-xs text-center text-[#6e6e78]">
              每次生成消耗 10 积分 · 生成时间约 30-60 秒
              {selectedStyleData && ` · ${selectedStyleData.label}`}
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
                {result && (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 rounded-lg bg-white/[0.04] text-[#98989d] hover:text-white hover:bg-white/[0.08] transition-all"
                    title="下载视频"
                  >
                    <Download className="h-4 w-4" />
                  </motion.button>
                )}
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    /* 生成中动画 */
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col items-center justify-center h-[400px] gap-5"
                    >
                      {/* 胶片动画 */}
                      <div className="relative">
                        <motion.div
                          className="w-24 h-24 rounded-xl border-2 border-[#5e5ce6]/30 flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        >
                          <Film className="h-10 w-10 text-[#5e5ce6]" />
                        </motion.div>
                        <div className="absolute -inset-3 rounded-2xl border border-[#5e5ce6]/10 animate-pulse" />
                      </div>

                      <div className="text-center">
                        <p className="text-white font-medium">
                          {GENERATION_STAGES[Math.min(generationStage, GENERATION_STAGES.length - 1)]}
                        </p>
                        <p className="text-sm text-[#98989d] mt-1">
                          阶段 {Math.min(generationStage + 1, GENERATION_STAGES.length)} / {GENERATION_STAGES.length}
                        </p>
                      </div>

                      {/* 阶段进度条 */}
                      <div className="w-64 space-y-1.5">
                        {GENERATION_STAGES.map((_, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div
                              className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${
                                i < generationStage
                                  ? "bg-[#5e5ce6]"
                                  : i === generationStage
                                  ? "bg-gradient-to-r from-[#5e5ce6]/50 to-transparent"
                                  : "bg-white/[0.06]"
                              }`}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : result ? (
                    /* 视频播放器 */
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-3"
                    >
                      <div className="relative group rounded-xl overflow-hidden bg-black">
                        <video
                          ref={videoRef}
                          src={result}
                          className="w-full aspect-video object-cover"
                          onEnded={() => setIsPlaying(false)}
                        />
                        {/* 播放按钮叠加层 */}
                        <div
                          onClick={togglePlay}
                          className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 group-hover:bg-black/30 transition-colors"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white"
                          >
                            {isPlaying ? (
                              <Pause className="h-7 w-7" />
                            ) : (
                              <Play className="h-7 w-7 ml-1" />
                            )}
                          </motion.div>
                        </div>
                      </div>

                      {/* 视频信息 */}
                      <div className="flex items-center gap-4 text-xs text-[#6e6e78]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {duration.seconds}s
                        </span>
                        {selectedStyleData && <span>{selectedStyleData.emoji} {selectedStyleData.label}</span>}
                        <span className="flex items-center gap-1">
                          <Music className="h-3 w-3" />
                          含音频
                        </span>
                      </div>
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
                        <Video className="h-8 w-8 text-[#6e6e78]" />
                      </div>
                      <div className="text-center">
                        <p className="text-[#98989d] font-medium">尚未生成</p>
                        <p className="text-sm text-[#6e6e78] mt-1">
                          {mode === "text"
                            ? "输入文字描述，AI 将为你生成视频"
                            : "上传参考图片，让静态画面动起来"}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
