"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Sparkles, Copy, Download, FileSpreadsheet, Presentation, ScrollText, RefreshCw } from "lucide-react";

const DOC_TOOLS = [
  { id: "summary", label: "文档摘要", icon: ScrollText, desc: "提取核心要点", color: "#ff375f" },
  { id: "ppt", label: "PPT 大纲", icon: Presentation, desc: "一键生成大纲", color: "#ff9f0a" },
  { id: "writing", label: "智能写作", icon: FileSpreadsheet, desc: "扩写润色优化", color: "#0a84ff" },
];

export default function DocumentPage() {
  const [activeDocTool, setActiveDocTool] = useState("summary");
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!text.trim()) return;
    setIsProcessing(true); setResult("");
    try {
      const typeLabels: Record<string, string> = { summary: "摘要", ppt: "PPT大纲", writing: "润色优化" };
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: `你是一个文档助手。请对以下文档进行${typeLabels[activeDocTool] || "处理"}。格式清晰，中文输出。` },
            { role: "user", content: text },
          ],
        }),
      });
      const data = await res.json();
      setResult(data.reply || "处理失败");
    } catch {
      setResult("文档服务暂时不可用");
    }
    setIsProcessing(false);
  };

  const handleCopy = () => {
    if (result) { navigator.clipboard.writeText(result); alert("已复制到剪贴板"); }
  };

  const handleExport = async () => {
    if (!result) return;

    if (activeDocTool === "ppt") {
      // 调用服务端 API 生成真正的 PPTX 文件
      const res = await fetch("/api/export/ppt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: result }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `豆角PPT_${new Date().toLocaleDateString()}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // 摘要和写作导出 TXT
      const blob = new Blob([result], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `豆角文档_${new Date().toLocaleDateString()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const tool = DOC_TOOLS.find(t => t.id === activeDocTool)!;

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff375f]/10"><FileText className="h-5 w-5 text-[#ff375f]" /></div>
          <div><h1 className="text-2xl font-bold text-white">AI 文档助手</h1><p className="text-sm text-[#98989d]">智能写作、摘要、PPT 大纲，办公效率翻倍</p></div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            {/* 工具选择 */}
            <div className="rounded-2xl glass p-5">
              <label className="text-sm font-semibold text-white mb-3 block">选择功能</label>
              <div className="flex gap-2">
                {DOC_TOOLS.map(t => (
                  <motion.button key={t.id} whileTap={{ scale: 0.97 }}
                    onClick={() => { setActiveDocTool(t.id); setResult(""); }}
                    className={`flex-1 flex flex-col items-center gap-1.5 rounded-xl p-3 transition-all ${
                      activeDocTool === t.id ? "bg-white/[0.08] border border-white/10" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"
                    }`}>
                    <t.icon className="h-6 w-6" style={{ color: t.color }} />
                    <span className="text-xs font-medium text-white">{t.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* 输入区 */}
            <div className="rounded-2xl glass p-5">
              <label className="text-sm font-semibold text-white mb-3 block">输入文本</label>
              <textarea value={text} onChange={e => setText(e.target.value)}
                placeholder="粘贴或输入需要处理的文本内容..."
                rows={10} className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3.5 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none focus:border-[#ff375f]/40 transition-all" />
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={handleProcess} disabled={!text.trim() || isProcessing}
                className={`mt-4 w-full rounded-xl py-3.5 text-sm font-semibold text-white ${!text.trim() ? "opacity-30 cursor-not-allowed" : ""}`}
                style={{ background: "linear-gradient(135deg, #ff375f, #ff9f0a)" }}>
                <span className="flex items-center justify-center gap-2">
                  {isProcessing ? <><RefreshCw className="h-4 w-4 animate-spin" />处理中...</> : <><Sparkles className="h-4 w-4" />{tool.label}</>}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* 结果区 */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="rounded-2xl glass p-5 min-h-[400px] flex flex-col">
              <h3 className="text-sm font-semibold text-white mb-4">处理结果</h3>
              <div className="flex-1">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-12 h-12 rounded-xl animate-pulse" style={{ background: `linear-gradient(135deg, ${tool.color}, transparent)` }} />
                    <p className="text-sm text-white mt-4">正在{tool.label}...</p>
                  </div>
                ) : result ? (
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4">
                    <p className="text-sm text-[#98989d] leading-relaxed whitespace-pre-wrap">{result}</p>
                    <div className="flex gap-2 mt-4">
                      <button onClick={handleCopy} className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-[#98989d] hover:text-white transition-colors"><Copy className="h-3 w-3" />复制</button>
                      <button onClick={handleExport} className="flex items-center gap-1 rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-[#98989d] hover:text-white transition-colors"><Download className="h-3 w-3" />导出</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-24">
                    <FileText className="h-10 w-10 text-[#6e6e78]" />
                    <p className="text-[#98989d] text-sm mt-3">输入文本并选择功能</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
