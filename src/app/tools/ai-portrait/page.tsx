"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, RefreshCw, Download, Sparkles, User, Users, Heart, Star } from "lucide-react";

const PORTRAIT_STYLES = [
  { id: "professional", label: "职业形象", emoji: "💼", desc: "西装革履" },
  { id: "casual", label: "日常随拍", emoji: "📸", desc: "自然清新" },
  { id: "retro", label: "复古胶片", emoji: "📷", desc: "港风质感" },
  { id: "fantasy", label: "奇幻写真", emoji: "🧝", desc: "梦幻仙境" },
  { id: "hanfu", label: "国风汉服", emoji: "👘", desc: "古韵典雅" },
  { id: "id", label: "证件照", emoji: "🪪", desc: "正式端庄" },
];

export default function AiPortraitPage() {
  const [images, setImages] = useState<string[]>([]);
  const [style, setStyle] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(f => setImages(prev => [...prev, URL.createObjectURL(f)]));
  };

  const handleGenerate = async () => {
    setIsGenerating(true); setResults([]);
    await new Promise(r => setTimeout(r, 3000));
    setResults([...images]); setIsGenerating(false);
  };

  const selectedStyle = PORTRAIT_STYLES.find(s => s.id === style)!;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#40c8e0]/10"><Camera className="h-5 w-5 text-[#40c8e0]" /></div>
          <div><h1 className="text-2xl font-bold text-white">AI 写真生成</h1><p className="text-sm text-[#98989d]">上传几张自拍，生成专业级写真照片</p></div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            {/* 上传自拍 */}
            <div className="rounded-2xl glass p-5">
              <label className="text-sm font-semibold text-white mb-3 block flex items-center gap-2"><User className="h-4 w-4 text-[#40c8e0]" />上传自拍照片（建议 3-5 张）</label>
              <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
              <div className="grid grid-cols-3 gap-2 mb-3">
                {images.map((img, i) => (
                  <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                    <img src={img} alt={`自拍${i+1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
                <div onClick={() => fileRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-white/[0.08] hover:border-white/[0.15] transition-all flex flex-col items-center justify-center cursor-pointer gap-1">
                  <Upload className="h-5 w-5 text-[#6e6e78]" />
                  <span className="text-[10px] text-[#6e6e78]">上传</span>
                </div>
              </div>
              <p className="text-xs text-[#6e6e78]">建议正面、侧面、半身各一张，面部清晰</p>
            </div>

            {/* 风格选择 */}
            <div className="rounded-2xl glass p-5">
              <label className="text-sm font-semibold text-white mb-3 block">写真风格</label>
              <div className="grid grid-cols-3 gap-2">
                {PORTRAIT_STYLES.map(s => (
                  <motion.button key={s.id} whileTap={{ scale: 0.95 }}
                    onClick={() => setStyle(s.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                      style === s.id ? "bg-white/[0.08] border border-white/10" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"
                    }`}>
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="text-xs font-medium text-white">{s.label}</span>
                    <span className="text-[10px] text-[#6e6e78]">{s.desc}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handleGenerate} disabled={images.length === 0 || isGenerating}
              className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white ${images.length === 0 ? "opacity-30 cursor-not-allowed" : ""}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#40c8e0] to-[#0a84ff]" />
              <span className="relative flex items-center justify-center gap-2">
                {isGenerating ? <><RefreshCw className="h-4 w-4 animate-spin" />生成中...</> : <><Sparkles className="h-4 w-4" />生成 {selectedStyle.label} 写真</>}
              </span>
            </motion.button>
          </motion.div>

          {/* 结果 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-2xl glass p-5 min-h-[500px]">
              <h3 className="text-sm font-semibold text-white mb-4">生成结果</h3>
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#40c8e0] to-[#0a84ff] animate-pulse mx-auto" />
                    <p className="text-white text-sm mt-4">AI 正在生成你的写真...</p>
                    <p className="text-xs text-[#6e6e78] mt-1">正在学习你的面部特征</p>
                  </motion.div>
                ) : results.length > 0 ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="grid grid-cols-2 gap-3">
                      {results.map((img, i) => (
                        <div key={i} className="relative group rounded-xl overflow-hidden">
                          <img src={img} alt={`写真${i+1}`} className="w-full aspect-[3/4] object-cover" />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Download className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
                    <Camera className="h-10 w-10 text-[#6e6e78] mx-auto" />
                    <p className="text-[#98989d] text-sm mt-3">上传自拍开始生成</p>
                    <div className="flex items-center gap-4 mt-4 text-xs text-[#6e6e78]">
                      <span className="flex items-center gap-1"><Star className="h-3 w-3" />高清画质</span>
                      <span className="flex items-center gap-1"><Heart className="h-3 w-3" />多种风格</span>
                    </div>
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
