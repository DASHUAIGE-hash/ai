"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, RefreshCw, Palette, Download, Sparkles } from "lucide-react";

const STYLE_PRESETS = [
  { id: "vangogh", label: "梵高", emoji: "🌻", desc: "星月夜般的笔触", color: "#ff9f0a" },
  { id: "monet", label: "莫奈", emoji: "🌸", desc: "印象派光影", color: "#ff6b9d" },
  { id: "picasso", label: "毕加索", emoji: "🎭", desc: "立体主义", color: "#5e5ce6" },
  { id: "ukiyoe", label: "浮世绘", emoji: "🌊", desc: "日本传统版画", color: "#0a84ff" },
  { id: "cyberpunk", label: "赛博朋克", emoji: "🌃", desc: "霓虹未来", color: "#30d158" },
  { id: "ink", label: "水墨画", emoji: "🏔️", desc: "中国水墨意境", color: "#8b5cf6" },
  { id: "popart", label: "波普艺术", emoji: "🟥", desc: "安迪·沃霍尔风", color: "#ff375f" },
  { id: "pencil", label: "素描", emoji: "✏️", desc: "黑白手绘质感", color: "#98989d" },
];

export default function StyleTransferPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState("vangogh");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleTransfer = async () => {
    if (!image) return;
    setIsProcessing(true); setResult(null);
    await new Promise(r => setTimeout(r, 3000));
    setResult(image); setIsProcessing(false);
  };

  const style = STYLE_PRESETS.find(s => s.id === selectedStyle)!;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#bf5af2]/10"><Palette className="h-5 w-5 text-[#bf5af2]" /></div>
          <div><h1 className="text-2xl font-bold text-white">风格迁移</h1><p className="text-sm text-[#98989d]">将照片变成任何艺术风格，一秒变身大师之作</p></div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            {/* 上传 */}
            <div className="rounded-2xl glass p-5">
              <label className="text-sm font-semibold text-white mb-3 block">上传你的照片</label>
              <label className="cursor-pointer block rounded-xl border-2 border-dashed border-white/[0.08] hover:border-white/[0.15] transition-all p-10 text-center"
                onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setImage(URL.createObjectURL(f)); }}>
                <input type="file" accept="image/*" onChange={e => { const f = e.target.files?.[0]; if (f) setImage(URL.createObjectURL(f)); }} className="hidden" />
                {image ? (
                  <img src={image} alt="原图" className="max-h-48 mx-auto rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-8 w-8 text-[#6e6e78]" />
                    <p className="text-sm text-[#98989d]">点击或拖拽上传</p>
                  </div>
                )}
              </label>
            </div>

            {/* 风格选择 */}
            <div className="rounded-2xl glass p-5">
              <label className="text-sm font-semibold text-white mb-3 block">选择艺术风格</label>
              <div className="grid grid-cols-4 gap-2">
                {STYLE_PRESETS.map(s => (
                  <motion.button key={s.id} whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedStyle(s.id)}
                    className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                      selectedStyle === s.id ? "bg-white/[0.08] border border-white/10 scale-105" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"
                    }`}>
                    <span className="text-2xl">{s.emoji}</span>
                    <span className="text-xs font-medium text-white">{s.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
              onClick={handleTransfer} disabled={!image || isProcessing}
              className={`group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white ${!image ? "opacity-30 cursor-not-allowed" : ""}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-[#bf5af2] to-[#ff375f]" />
              <span className="relative flex items-center justify-center gap-2">
                {isProcessing ? <><RefreshCw className="h-4 w-4 animate-spin" />风格迁移中...</> : <><Sparkles className="h-4 w-4" />开始风格迁移</>}
              </span>
            </motion.button>
          </motion.div>

          {/* 结果 + 对比 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-2xl glass p-5 min-h-[500px]">
              <h3 className="text-sm font-semibold text-white mb-4">迁移结果</h3>
              <AnimatePresence mode="wait">
                {isProcessing ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
                    <div className="w-16 h-16 rounded-2xl animate-pulse mx-auto" style={{ background: `linear-gradient(135deg, ${style.color}, transparent)` }} />
                    <p className="text-white text-sm mt-4">正在应用 {style.label} 风格...</p>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-[#6e6e78] mb-2 text-center">原图</p>
                        <img src={image!} alt="原图" className="w-full rounded-xl" />
                      </div>
                      <div>
                        <p className="text-xs text-[#6e6e78] mb-2 text-center">{style.label}风格</p>
                        <img src={result} alt="结果" className="w-full rounded-xl" style={{ filter: `sepia(0.3) hue-rotate(${style.id === 'cyberpunk' ? '200deg' : style.id === 'vangogh' ? '30deg' : '0deg'})` }} />
                      </div>
                    </div>
                    <div className="flex justify-center"><Download className="h-5 w-5 text-[#98989d] cursor-pointer hover:text-white" /></div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-32">
                    <Palette className="h-10 w-10 text-[#6e6e78] mx-auto" />
                    <p className="text-[#98989d] text-sm mt-3">上传图片选择风格</p>
                    <p className="text-xs text-[#6e6e78] mt-1">原图与结果将并排展示</p>
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
