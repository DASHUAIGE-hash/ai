"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, Wand2, Scissors, Maximize, Droplets, RefreshCw, ImagePlus, SlidersHorizontal } from "lucide-react";

const EDIT_TOOLS = [
  { id: "bg-remove", label: "一键抠图", icon: Scissors, desc: "智能识别主体，去除背景", color: "#0a84ff" },
  { id: "upscale", label: "高清放大", icon: Maximize, desc: "提升分辨率至 4K/8K", color: "#5e5ce6" },
  { id: "restore", label: "老照片修复", icon: Droplets, desc: "修复划痕、噪点、褪色", color: "#ff9f0a" },
  { id: "expand", label: "图片扩图", icon: ImagePlus, desc: "AI 补全画面边界", color: "#30d158" },
];

export default function ImageEditorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState("bg-remove");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImage(URL.createObjectURL(file)); setResult(null); }
  };

  const handleProcess = async () => {
    setIsProcessing(true); setResult(null);
    await new Promise(r => setTimeout(r, 2500));
    setResult(image); setIsProcessing(false);
  };

  const activeToolData = EDIT_TOOLS.find(t => t.id === activeTool)!;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff9f0a]/10"><Wand2 className="h-5 w-5 text-[#ff9f0a]" /></div>
          <div><h1 className="text-2xl font-bold text-white">图片智能编辑</h1><p className="text-sm text-[#98989d]">AI 驱动的图片处理工具，无需 Photoshop</p></div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            {/* 工具栏 */}
            <div className="rounded-2xl glass p-5">
              <label className="text-sm font-semibold text-white mb-3 block">选择编辑工具</label>
              <div className="grid grid-cols-2 gap-2">
                {EDIT_TOOLS.map(tool => (
                  <motion.button key={tool.id} whileTap={{ scale: 0.97 }}
                    onClick={() => { setActiveTool(tool.id); setResult(null); }}
                    className={`flex flex-col items-center gap-1.5 rounded-xl p-4 text-center transition-all duration-200 ${
                      activeTool === tool.id ? "bg-white/[0.08] border border-white/10" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"
                    }`}
                  >
                    <tool.icon className="h-6 w-6" style={{ color: tool.color }} />
                    <span className="text-sm font-medium text-white">{tool.label}</span>
                    <span className="text-[10px] text-[#6e6e78]">{tool.desc}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 上传区 */}
            <div className="rounded-2xl glass p-5">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <div onClick={() => fileRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
                  image ? "border-[#0a84ff]/30 p-2" : "border-white/[0.08] p-10 hover:border-white/[0.15]"
                }`}>
                {image ? (
                  <img src={image} alt="原图" className="w-full h-48 object-cover rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <Upload className="h-8 w-8 text-[#6e6e78]" />
                    <p className="text-sm text-[#98989d]">点击上传图片</p>
                  </div>
                )}
              </div>

              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={handleProcess} disabled={!image || isProcessing}
                className={`mt-4 group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white transition-all ${
                  !image ? "opacity-30 cursor-not-allowed" : ""
                }`}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a84ff] to-[#5e5ce6]" />
                <span className="relative flex items-center justify-center gap-2">
                  {isProcessing ? <><RefreshCw className="h-4 w-4 animate-spin" />处理中...</> : <><Wand2 className="h-4 w-4" />{activeToolData.label}</>}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* 结果区 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-2xl glass p-5 min-h-[500px] flex flex-col">
              <h3 className="text-sm font-semibold text-white mb-4">处理结果</h3>
              <div className="flex-1 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0a84ff] to-[#5e5ce6] animate-pulse mx-auto" />
                      <p className="text-white text-sm mt-4">AI 正在处理...</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full">
                      <div className="relative group rounded-xl overflow-hidden">
                        <img src={result} alt="结果" className="w-full object-cover rounded-xl" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Download className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <p className="text-center text-xs text-[#6e6e78] mt-3">{activeToolData.label} 完成</p>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                      <Wand2 className="h-10 w-10 text-[#6e6e78] mx-auto" />
                      <p className="text-[#98989d] text-sm mt-3">上传图片并选择工具</p>
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
