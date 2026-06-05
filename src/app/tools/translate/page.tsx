"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Languages, ArrowRightLeft, Copy, Volume2, Sparkles, RefreshCw } from "lucide-react";

const LANGUAGES = [
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
];

const MOCK_TEXT: Record<string, string> = {
  zh: "人工智能正在改变我们创作内容的方式。从文字到图像，从音乐到视频，AI 让每个人都能成为创作者。",
  en: "Artificial intelligence is transforming the way we create content. From text to images, from music to video, AI enables everyone to become a creator.",
  ja: "人工知能は私たちのコンテンツ作成方法を変えています。テキストから画像へ、音楽から動画へ、AIは誰もがクリエイターになれるようにします。",
  ko: "인공지능은 우리가 콘텐츠를 만드는 방식을 변화시키고 있습니다. 텍스트에서 이미지로, 음악에서 비디오로, AI는 모든 사람이 창작자가 될 수 있게 합니다.",
};

export default function TranslatePage() {
  const [sourceLang, setSourceLang] = useState("zh");
  const [targetLang, setTargetLang] = useState("en");
  const [sourceText, setSourceText] = useState("");
  const [translated, setTranslated] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你是一个翻译助手。将以下文本从${LANGUAGES.find(l => l.code === sourceLang)?.label}翻译成${LANGUAGES.find(l => l.code === targetLang)?.label}。只输出翻译结果。` },
            { role: "user", content: sourceText },
          ],
        }),
      });
      const data = await res.json();
      setTranslated(data.reply || "翻译失败");
    } catch {
      setTranslated("翻译服务暂时不可用");
    }
    setIsTranslating(false);
  };

  const swapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translated);
    setTranslated(sourceText);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#64d2ff]/10"><Languages className="h-5 w-5 text-[#64d2ff]" /></div>
          <div><h1 className="text-2xl font-bold text-white">智能翻译</h1><p className="text-sm text-[#98989d]">支持 20+ 语言，精准流畅的 AI 翻译</p></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl glass p-6">
          {/* 语言选择栏 */}
          <div className="flex items-center gap-3 mb-6">
            <select value={sourceLang} onChange={e => setSourceLang(e.target.value)}
              className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#64d2ff]/40 appearance-none cursor-pointer">
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
            </select>
            <motion.button whileTap={{ scale: 0.9 }} onClick={swapLangs}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors">
              <ArrowRightLeft className="h-4 w-4 text-[#98989d]" />
            </motion.button>
            <select value={targetLang} onChange={e => setTargetLang(e.target.value)}
              className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#64d2ff]/40 appearance-none cursor-pointer">
              {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.label}</option>)}
            </select>
          </div>

          {/* 翻译区域 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <textarea value={sourceText} onChange={e => setSourceText(e.target.value)}
                placeholder="输入要翻译的文字..."
                rows={8}
                className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none focus:border-[#64d2ff]/40 transition-all" />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#6e6e78]">{sourceText.length} 字符</span>
                <button onClick={() => { setSourceText(MOCK_TEXT.zh); setTranslated(""); }}
                  className="text-xs text-[#64d2ff] hover:underline">试试示例</button>
              </div>
            </div>
            <div className="relative">
              <textarea value={translated} readOnly
                placeholder="翻译结果..."
                rows={8}
                className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none transition-all" />
              {isTranslating && (
                <div className="absolute inset-0 rounded-xl bg-black/40 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-[#64d2ff] animate-spin" />
                </div>
              )}
              {translated && (
                <div className="flex items-center gap-2 mt-2">
                  <button className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-[#98989d] hover:text-white transition-colors">
                    <Copy className="h-3 w-3" />复制
                  </button>
                  <button className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-[#98989d] hover:text-white transition-colors">
                    <Volume2 className="h-3 w-3" />朗读
                  </button>
                </div>
              )}
            </div>
          </div>

          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={handleTranslate} disabled={!sourceText.trim() || isTranslating}
            className={`mt-6 w-full rounded-xl py-3.5 text-sm font-semibold text-white transition-all ${!sourceText.trim() ? "opacity-30 cursor-not-allowed" : ""}`}
            style={{ background: "linear-gradient(135deg, #64d2ff, #0a84ff)" }}>
            <span className="flex items-center justify-center gap-2">
              {isTranslating ? <><RefreshCw className="h-4 w-4 animate-spin" />翻译中...</> : <><Sparkles className="h-4 w-4" />翻译</>}
            </span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
