"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Music, Play, Pause, Sparkles, RefreshCw, Download, SlidersHorizontal } from "lucide-react";

const MOODS = [
  { id: "relax", label: "放松", emoji: "🧘", color: "#30d158" },
  { id: "epic", label: "史诗", emoji: "⚔️", color: "#ff375f" },
  { id: "happy", label: "欢快", emoji: "🎉", color: "#ff9f0a" },
  { id: "sad", label: "伤感", emoji: "🌧️", color: "#0a84ff" },
  { id: "focus", label: "专注", emoji: "🧠", color: "#5e5ce6" },
  { id: "dream", label: "梦幻", emoji: "🌙", color: "#bf5af2" },
];

const GENRES = ["钢琴曲", "电子", "古典", "爵士", "Lo-fi", "中国风"];

export default function MusicGenPage() {
  const [mood, setMood] = useState("relax");
  const [genre, setGenre] = useState("钢琴曲");
  const [duration, setDuration] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true); setHasResult(false);
    await new Promise(r => setTimeout(r, 3000));
    setHasResult(true); setIsGenerating(false);
  };

  const selectedMood = MOODS.find(m => m.id === mood)!;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff6482]/10"><Music className="h-5 w-5 text-[#ff6482]" /></div>
          <div><h1 className="text-2xl font-bold text-white">AI 音乐生成</h1><p className="text-sm text-[#98989d]">根据场景和情绪，自动生成背景音乐</p></div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            {/* 情绪 */}
            <div className="rounded-2xl glass p-5">
              <label className="text-sm font-semibold text-white mb-3 block">选择情绪</label>
              <div className="grid grid-cols-3 gap-2">
                {MOODS.map(m => (
                  <motion.button key={m.id} whileTap={{ scale: 0.95 }}
                    onClick={() => setMood(m.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                      mood === m.id ? "bg-white/[0.08] border border-white/10" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"
                    }`}>
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-xs font-medium text-white">{m.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 风格 + 时长 */}
            <div className="rounded-2xl glass p-5 space-y-4">
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">音乐风格</label>
                <div className="flex flex-wrap gap-2">
                  {GENRES.map(g => (
                    <button key={g} onClick={() => setGenre(g)}
                      className={`rounded-full px-3.5 py-1.5 text-xs transition-all ${
                        genre === g ? "bg-[#ff6482]/15 text-[#ff6482] border border-[#ff6482]/20" : "bg-white/[0.03] text-[#98989d] border border-transparent hover:bg-white/[0.06]"
                      }`}>{g}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-white mb-2 block">时长：{duration} 秒</label>
                <input type="range" min="10" max="120" step="10" value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/[0.08] cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#ff6482] [&::-webkit-slider-thumb]:cursor-pointer" />
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handleGenerate} disabled={isGenerating}
              className="group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff6482] to-[#bf5af2]" />
              <span className="relative flex items-center justify-center gap-2">
                {isGenerating ? <><RefreshCw className="h-4 w-4 animate-spin" />正在谱曲...</> : <><Sparkles className="h-4 w-4" />生成音乐</>}
              </span>
            </motion.button>
          </motion.div>

          {/* 播放器 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-2xl glass p-5 min-h-[400px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff6482] to-[#bf5af2] animate-pulse mx-auto flex items-center justify-center">
                      <Music className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-white text-sm mt-4">AI 正在创作 {genre}...</p>
                    <p className="text-xs text-[#6e6e78] mt-1">情绪：{selectedMood.emoji} {selectedMood.label}</p>
                    {/* 音波模拟 */}
                    <div className="flex items-center justify-center gap-0.5 mt-4 h-8">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div key={i} className="w-1 rounded-full bg-[#ff6482]"
                          animate={{ height: [8, 24, 12, 28, 8][i % 5] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.08 }} />
                      ))}
                    </div>
                  </motion.div>
                ) : hasResult ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff6482]/20 to-[#bf5af2]/20 mx-auto flex items-center justify-center border-2 border-[#ff6482]/20">
                      {isPlaying ? <Pause className="h-8 w-8 text-[#ff6482]" /> : <Play className="h-8 w-8 text-[#ff6482] ml-1" />}
                    </div>
                    <p className="text-white font-medium mt-4">{genre} · {selectedMood.label}情绪</p>
                    <p className="text-xs text-[#6e6e78] mt-1">{duration} 秒</p>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button onClick={() => setIsPlaying(!isPlaying)}
                        className="rounded-xl px-4 py-2 text-xs text-white"
                        style={{ background: `linear-gradient(135deg, #ff6482, #bf5af2)` }}>
                        {isPlaying ? "暂停" : "播放"}
                      </button>
                      <button className="rounded-xl bg-white/[0.04] px-4 py-2 text-xs text-[#98989d] hover:text-white transition-colors flex items-center gap-1">
                        <Download className="h-3 w-3" />下载
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/[0.03] mx-auto">
                      <Music className="h-10 w-10 text-[#6e6e78]" />
                    </div>
                    <p className="text-[#98989d] text-sm mt-4">选择情绪和风格</p>
                    <p className="text-xs text-[#6e6e78] mt-1">AI 将为你生成专属音乐</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
