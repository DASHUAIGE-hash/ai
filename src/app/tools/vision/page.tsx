"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Copy, RefreshCw, Eye, Sparkles, Scan } from "lucide-react";

export default function VisionPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult("");
      setProgress(0);
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setResult("");
    setProgress(0);

    try {
      // 动态加载 Tesseract（只在需要时加载，减少初始体积）
      const Tesseract = (await import("tesseract.js")).default;

      const worker = await Tesseract.createWorker("chi_sim+eng", 1, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const { data } = await worker.recognize(image);
      const text = data.text.trim();

      await worker.terminate();

      if (text) {
        setResult(text);
      } else {
        setResult("未识别到文字内容。请确保图片中包含清晰的文字。");
      }
    } catch (err: any) {
      setResult("识别失败：" + (err.message || "未知错误"));
    }
    setIsAnalyzing(false);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#64d2ff]/10">
            <Scan className="h-5 w-5 text-[#64d2ff]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI 识图</h1>
            <p className="text-sm text-[#98989d]">上传截图，OCR 提取文字内容（本地识别，无需联网）</p>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 上传区 */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div className="rounded-2xl glass p-5">
              <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
              <div
                onClick={() => fileRef.current?.click()}
                className={`cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 ${
                  image ? "border-[#64d2ff]/30 p-2" : "border-white/[0.08] p-12 hover:border-white/[0.15]"
                }`}
              >
                {image ? (
                  <img src={image} alt="上传" className="w-full max-h-64 object-contain rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
                      <Upload className="h-8 w-8 text-[#6e6e78]" />
                    </div>
                    <p className="text-sm text-[#98989d]">点击上传截图或图片</p>
                    <p className="text-xs text-[#6e6e78]">支持 JPG/PNG · 本地 OCR 引擎</p>
                  </div>
                )}
              </div>

              {image && (
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleScan}
                  disabled={isAnalyzing}
                  className="mt-4 group relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-semibold text-white"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#64d2ff] to-[#0a84ff]" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isAnalyzing ? (
                      <><RefreshCw className="h-4 w-4 animate-spin" />识别中 {progress}%</>
                    ) : (
                      <><Scan className="h-4 w-4" />开始识别文字</>
                    )}
                  </span>
                </motion.button>
              )}
            </div>

            {isAnalyzing && (
              <div className="rounded-2xl glass p-5">
                <p className="text-sm text-white text-center">正在下载 OCR 语言包...</p>
                <p className="text-xs text-[#6e6e78] text-center mt-1">首次使用需下载约 15MB，之后秒出结果</p>
                <div className="mt-3 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[#64d2ff] to-[#0a84ff]"
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* 结果区 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-2xl glass p-5 min-h-[400px] flex flex-col">
              <h3 className="text-sm font-semibold text-white mb-4">识别结果</h3>
              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#64d2ff] to-[#0a84ff] animate-pulse mx-auto" />
                      <p className="text-sm text-white mt-4">OCR 引擎工作中...</p>
                    </motion.div>
                  ) : result ? (
                    <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 max-h-[400px] overflow-y-auto">
                        <pre className="text-sm text-[#98989d] leading-relaxed whitespace-pre-wrap font-sans">{result}</pre>
                      </div>
                      <button
                        onClick={() => { navigator.clipboard.writeText(result); }}
                        className="flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-3.5 py-2 text-xs text-[#98989d] hover:text-white transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />复制结果
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24">
                      <Scan className="h-10 w-10 text-[#6e6e78] mx-auto" />
                      <p className="text-[#98989d] text-sm mt-3">上传截图后点击识别</p>
                      <p className="text-xs text-[#6e6e78] mt-1">本地 OCR 引擎提取图片中的文字</p>
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
