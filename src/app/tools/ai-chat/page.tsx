"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send, Bot, User, Sparkles, Paperclip, Mic, Smile, Clock } from "lucide-react";

const MOCK_CHAT = [
  { role: "assistant", text: "你好！我是豆角 AI 助手 🤖 我可以帮你写文案、回答问题、分析图片、翻译内容... 尽管问我任何问题！", time: "刚刚" },
];

export default function AiChatPage() {
  const [messages, setMessages] = useState(MOCK_CHAT);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input, time: "刚刚" };
    setMessages(prev => [...prev, userMsg]); setInput(""); setIsTyping(true);
    try {
      const apiMessages = [
        { role: "system", content: "你是豆角AI助手，用中文回复，风格友好活泼。当需要展示数据、对比、列表时，请使用Markdown表格格式。" },
        ...messages.map(m => ({ role: m.role, content: m.text })),
        { role: "user", content: input },
      ];
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", text: data.reply || "抱歉，出了点问题", time: "刚刚" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "网络连接失败，请检查 API 配置", time: "刚刚" }]);
    }
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-6 h-[calc(100vh-10rem)] flex flex-col">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#30d158]/10"><MessageSquare className="h-5 w-5 text-[#30d158]" /></div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI 智能对话</h1>
            <p className="text-sm text-[#98989d]">多模态 AI 助手，随时为你服务</p>
          </div>
          <span className="ml-auto rounded-full bg-[#30d158]/10 px-3 py-1 text-xs text-[#30d158]">DeepSeek · 在线</span>
        </motion.div>

        {/* 消息区 */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "assistant" ? "bg-[#30d158]/15" : "bg-[#0a84ff]/15"}`}>
                {msg.role === "assistant" ? <Bot className="h-4 w-4 text-[#30d158]" /> : <User className="h-4 w-4 text-[#0a84ff]" />}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${msg.role === "user" ? "max-w-[75%] bg-[#0a84ff]/10 border border-[#0a84ff]/15" : "max-w-[90%] bg-white/[0.04] border border-white/[0.06]"}`}>
                {msg.role === "assistant" ? (
                  <div className="text-sm text-white leading-relaxed prose prose-invert prose-sm max-w-none
                    [&_table]:w-full [&_table]:border-collapse [&_table]:my-2
                    [&_th]:border [&_th]:border-white/10 [&_th]:px-3 [&_th]:py-1.5 [&_th]:bg-white/[0.04] [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold
                    [&_td]:border [&_td]:border-white/10 [&_td]:px-3 [&_td]:py-1.5 [&_td]:text-xs
                    [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:text-[#64d2ff]
                    [&_pre]:bg-white/[0.04] [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:overflow-x-auto [&_pre]:my-2 [&_pre]:border [&_pre]:border-white/[0.06]
                    [&_pre_code]:bg-transparent [&_pre_code]:p-0
                    [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5
                    [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_h3]:text-sm [&_h3]:font-bold
                    [&_p]:my-1 [&_strong]:font-bold [&_em]:italic
                    [&_blockquote]:border-l-2 [&_blockquote]:border-[#0a84ff]/30 [&_blockquote]:pl-3 [&_blockquote]:text-[#98989d]">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                )}
                <span className="text-[10px] text-[#6e6e78] mt-1 block">{msg.time}</span>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#30d158]/15"><Bot className="h-4 w-4 text-[#30d158]" /></div>
              <div className="rounded-2xl bg-white/[0.04] border border-white/[0.06] px-4 py-3">
                <div className="flex gap-1"><span className="w-2 h-2 rounded-full bg-[#6e6e78] animate-bounce" style={{ animationDelay: "0ms" }} /><span className="w-2 h-2 rounded-full bg-[#6e6e78] animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-2 h-2 rounded-full bg-[#6e6e78] animate-bounce" style={{ animationDelay: "300ms" }} /></div>
              </div>
            </div>
          )}
        </div>

        {/* 输入栏 */}
        <div className="rounded-2xl glass p-3 flex items-center gap-2">
          <button className="p-2 rounded-lg text-[#6e6e78] hover:text-white hover:bg-white/[0.06] transition-all"><Paperclip className="h-5 w-5" /></button>
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
            placeholder="输入你的问题..." className="flex-1 bg-transparent text-sm text-white placeholder:text-[#6e6e78] focus:outline-none" />
          <button className="p-2 rounded-lg text-[#6e6e78] hover:text-white hover:bg-white/[0.06] transition-all"><Mic className="h-5 w-5" /></button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={handleSend} disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-[#30d158] text-white disabled:opacity-30 transition-all">
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
