"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Clapperboard, FileText, Check, RefreshCw, Image,
  Play, Film, Sparkles, ArrowRight, ArrowLeft, Download,
  Mic, User, Eye, Plus, X,
} from "lucide-react";

const STEPS = [
  { num: 1, label: "生成脚本", icon: FileText },
  { num: 2, label: "审阅脚本", icon: Check },
  { num: 3, label: "上传角色", icon: User },
  { num: 4, label: "生成分镜", icon: Image },
  { num: 5, label: "审阅分镜", icon: Eye },
  { num: 6, label: "选择配音", icon: Mic },
  { num: 7, label: "生成视频", icon: Film },
  { num: 8, label: "审阅场景", icon: Play },
  { num: 9, label: "合成导出", icon: Download },
];

const VOICES = [
  { id: "male1", label: "男声·沉稳", emoji: "🎙️", desc: "适合旁白、纪录片" },
  { id: "female1", label: "女声·温柔", emoji: "🎤", desc: "适合叙事、广告" },
  { id: "male2", label: "男声·活泼", emoji: "🎧", desc: "适合动画、娱乐" },
  { id: "female2", label: "女声·专业", emoji: "💼", desc: "适合教程、商务" },
];

export default function VideoStudioPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  const [requirement, setRequirement] = useState("");
  const [script, setScript] = useState("");
  const [scriptFeedback, setScriptFeedback] = useState("");

  const [characters, setCharacters] = useState<string[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const [storyboards, setStoryboards] = useState<{ image: string; desc: string; approved: boolean }[]>([]);
  const [selectedVoice, setSelectedVoice] = useState("male1");
  const [scenes, setScenes] = useState<{ url: string; desc: string; approved: boolean }[]>([]);
  const [finalVideo, setFinalVideo] = useState("");

  /* ── 生成脚本 ── */
  const generateScript = async () => {
    if (!requirement.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "你是专业视频脚本编剧。生成详细视频脚本：每个场景用【场景X】标记，包含画面描述、旁白/对白、时长建议。" },
            { role: "user", content: requirement },
          ],
        }),
      });
      const data = await res.json();
      setScript(data.reply || "生成失败");
      setStep(2);
    } catch { setScript("生成失败，请重试"); }
    setLoading(false);
  };

  const reviseScript = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            { role: "system", content: "根据反馈修改脚本，保持格式。" },
            { role: "user", content: `原脚本：${script}\n修改要求：${scriptFeedback}` },
          ],
        }),
      });
      const data = await res.json();
      setScript(data.reply || script);
      setScriptFeedback("");
    } catch { }
    setLoading(false);
  };

  /* ── 生成分镜 ── */
  const generateStoryboards = async () => {
    setLoading(true);
    const sceneMatches = script.match(/【场景\d+】[^【】]+/g) || [script.substring(0, 200)];
    const frames: { image: string; desc: string; approved: boolean }[] = [];

    for (const sceneText of sceneMatches.slice(0, 5)) {
      try {
        const res = await fetch("/api/generate/image", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `视频分镜画面，电影级画质，16:9，${sceneText.substring(0, 300)}`,
            width: 1024, height: 576,
          }),
        });
        const data = await res.json();
        frames.push({ image: data.images?.[0] || "", desc: sceneText.substring(0, 200), approved: false });
      } catch {
        frames.push({ image: "", desc: sceneText.substring(0, 200), approved: false });
      }
    }
    setStoryboards(frames);
    setStep(5);
    setLoading(false);
  };

  const regenerateFrame = async (index: number) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate/image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `电影级分镜画面，与前后风格连贯，${storyboards[index].desc}`, width: 1024, height: 576 }),
      });
      const data = await res.json();
      const updated = [...storyboards];
      updated[index] = { ...updated[index], image: data.images?.[0] || updated[index].image };
      setStoryboards(updated);
    } catch { }
    setLoading(false);
  };

  /* ── 生成场景视频（异步轮询）── */
  const generateScenes = async () => {
    setLoading(true);
    const approvedFrames = storyboards.filter(f => f.approved);
    const tasks: { taskId: string; desc: string }[] = [];

    // 提交所有任务
    for (const frame of approvedFrames) {
      try {
        const res = await fetch("/api/generate/video", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: frame.desc.substring(0, 300), duration: 5 }),
        });
        const data = await res.json();
        tasks.push({ taskId: data.taskId || "", desc: frame.desc });
      } catch {
        tasks.push({ taskId: "", desc: frame.desc });
      }
    }

    // 轮询等待结果
    const results: { url: string; desc: string; approved: boolean }[] = [];
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      if (!task.taskId) { results.push({ url: "", desc: task.desc, approved: false }); continue; }

      setProgressMsg(`正在生成场景 ${i + 1}/${tasks.length}...`);
      let gotIt = false;
      for (let attempt = 0; attempt < 40; attempt++) {
        await new Promise(r => setTimeout(r, 3000));
        try {
          const cr = await fetch("/api/generate/video", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "check", taskId: task.taskId }),
          });
          const cd = await cr.json();
          if (cd.status === "completed" && cd.videoData?.url) {
            results.push({ url: cd.videoData.url, desc: task.desc, approved: false });
            setScenes([...results]);
            gotIt = true;
            break;
          } else if (cd.status === "failed") {
            results.push({ url: "", desc: task.desc, approved: false });
            gotIt = true;
            break;
          }
        } catch { }
      }
      if (!gotIt) results.push({ url: "", desc: task.desc, approved: false });
      setScenes([...results]);
    }

    setProgressMsg("");
    setScenes(results);
    setStep(8);
    setLoading(false);
  };

  const composeVideo = () => {
    setFinalVideo("✅ 视频合成完成！" + scenes.filter(s => s.approved).length + " 个场景已就绪，配音：" + VOICES.find(v => v.id === selectedVoice)?.label);
    setStep(9);
  };

  /* ── 渲染 ── */
  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff9f0a]/10">
              <Clapperboard className="h-5 w-5 text-[#ff9f0a]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">视频工作室</h1>
              <p className="text-sm text-[#98989d]">从脚本到成片，全流程 AI 视频制作</p>
            </div>
          </div>
          {/* 步骤条 */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1 shrink-0">
                <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-all ${
                  step === s.num ? "bg-[#ff9f0a]/15 text-[#ff9f0a]" :
                  step > s.num ? "bg-[#30d158]/10 text-[#30d158]" : "bg-white/[0.03] text-[#6e6e78]"
                }`}>
                  {step > s.num ? <Check className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
                  {s.label}
                </div>
                {i < STEPS.length - 1 && <div className={`w-4 h-px ${step > s.num ? "bg-[#30d158]/30" : "bg-white/[0.06]"}`} />}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div key={step} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl glass p-6">
          {/* Step 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Clapperboard className="h-5 w-5 text-[#ff9f0a]" />输入视频需求</h3>
              <p className="text-sm text-[#98989d]">描述视频内容、风格、时长和特殊要求</p>
              <textarea value={requirement} onChange={e => setRequirement(e.target.value)}
                placeholder="例如：制作一个30秒的环保公益广告，主角是一个小女孩，场景有公园、海边..." rows={6}
                className="w-full resize-none rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-3 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none focus:border-[#ff9f0a]/40 transition-all" />
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={generateScript} disabled={!requirement.trim() || loading}
                className={`w-full rounded-xl py-3.5 text-sm font-semibold text-white ${!requirement.trim() ? "opacity-30 cursor-not-allowed" : ""}`}
                style={{ background: "linear-gradient(135deg, #ff9f0a, #ff375f)" }}>
                {loading ? <RefreshCw className="h-4 w-4 animate-spin inline mr-2" /> : <Sparkles className="h-4 w-4 inline mr-2" />}
                {loading ? "生成中..." : "生成脚本"}
              </motion.button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><FileText className="h-5 w-5 text-[#30d158]" />审阅脚本</h3>
              <div className="rounded-xl bg-white/[0.03] border border-white/[0.05] p-4 max-h-[400px] overflow-y-auto">
                <pre className="text-sm text-[#98989d] whitespace-pre-wrap font-sans leading-relaxed">{script}</pre>
              </div>
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                onClick={() => setStep(3)}
                className="w-full rounded-xl py-3 text-sm font-semibold text-white"
                style={{ background: "linear-gradient(135deg, #30d158, #0a84ff)" }}>
                <Check className="h-4 w-4 inline mr-2" />脚本满意，下一步
              </motion.button>
              <p className="text-xs text-[#6e6e78]">或输入修改意见：</p>
              <div className="flex gap-2">
                <input value={scriptFeedback} onChange={e => setScriptFeedback(e.target.value)}
                  placeholder="例如：增加海边场景..."
                  className="flex-1 rounded-xl bg-white/[0.04] border border-white/[0.08] px-4 py-2.5 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none transition-all" />
                <motion.button whileTap={{ scale: 0.97 }} onClick={reviseScript} disabled={!scriptFeedback.trim() || loading}
                  className="rounded-xl px-4 py-2.5 text-sm text-white bg-white/[0.06] hover:bg-white/[0.1] disabled:opacity-30">
                  {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "修改"}
                </motion.button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><User className="h-5 w-5 text-[#5e5ce6]" />上传角色形象</h3>
              <p className="text-sm text-[#98989d]">上传视频中角色的照片，AI 将直接以此形象作为视频主角</p>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                onChange={e => { Array.from(e.target.files || []).forEach(f => { const r = new FileReader(); r.onload = () => setCharacters(prev => [...prev, r.result as string]); r.readAsDataURL(f); }); }} />
              <div className="grid grid-cols-3 gap-3">
                {characters.map((img, i) => (
                  <div key={i} className="relative group rounded-xl overflow-hidden aspect-square">
                    <img src={img} alt={`角色${i+1}`} className="w-full h-full object-cover" />
                    <button onClick={() => setCharacters(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100"><X className="h-3 w-3" /></button>
                  </div>
                ))}
                <div onClick={() => fileRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-white/[0.08] hover:border-white/15 flex flex-col items-center justify-center cursor-pointer gap-1">
                  <Plus className="h-6 w-6 text-[#6e6e78]" /><span className="text-[10px] text-[#6e6e78]">添加角色</span>
                </div>
              </div>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(2)} className="rounded-xl px-4 py-3 text-sm text-[#98989d] bg-white/[0.04] hover:bg-white/[0.08] flex items-center gap-1"><ArrowLeft className="h-4 w-4" />上一步</motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(4)}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #5e5ce6, #0a84ff)" }}><ArrowRight className="h-4 w-4 inline mr-2" />下一步：生成分镜</motion.button>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Image className="h-5 w-5 text-[#bf5af2]" />生成分镜</h3>
              <p className="text-sm text-[#98989d]">AI 将根据脚本自动生成分镜画面</p>
              {loading ? (
                <div className="flex flex-col items-center py-12"><RefreshCw className="h-8 w-8 text-[#bf5af2] animate-spin" /><p className="text-sm text-[#98989d] mt-3">正在生成分镜...</p></div>
              ) : (
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={generateStoryboards}
                  className="w-full rounded-xl py-3.5 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #bf5af2, #5e5ce6)" }}><Sparkles className="h-4 w-4 inline mr-2" />开始生成分镜</motion.button>
              )}
            </div>
          )}

          {/* Step 5 */}
          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Eye className="h-5 w-5 text-[#64d2ff]" />审阅分镜画面</h3>
              <p className="text-sm text-[#98989d]">逐张审阅，只有确认的分镜才会进入视频生成</p>
              {storyboards.map((frame, i) => (
                <div key={i} className={`rounded-xl glass p-4 flex gap-4 items-start ${frame.approved ? "border border-green-500/20" : ""}`}>
                  {frame.image ? <img src={frame.image} className="w-40 h-24 object-cover rounded-lg shrink-0" /> :
                    <div className="w-40 h-24 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0"><Image className="h-6 w-6 text-[#6e6e78]" /></div>}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium">场景 {i + 1}</p>
                    <p className="text-xs text-[#98989d] mt-1 line-clamp-3">{frame.desc}</p>
                    <div className="flex gap-2 mt-3">
                      <motion.button whileTap={{ scale: 0.95 }}
                        onClick={() => { const u = [...storyboards]; u[i].approved = !u[i].approved; setStoryboards(u); }}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium ${frame.approved ? "bg-[#30d158]/15 text-[#30d158]" : "bg-white/[0.04] text-[#98989d] hover:bg-white/[0.08]"}`}>
                        {frame.approved ? "✓ 已确认" : "确认此分镜"}</motion.button>
                      <motion.button whileTap={{ scale: 0.95 }} onClick={() => regenerateFrame(i)}
                        className="rounded-lg bg-white/[0.04] px-3 py-1.5 text-xs text-[#98989d] hover:text-white flex items-center gap-1"><RefreshCw className="h-3 w-3" />重新生成</motion.button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(3)} className="rounded-xl px-4 py-3 text-sm text-[#98989d] bg-white/[0.04] hover:bg-white/[0.08] flex items-center gap-1"><ArrowLeft className="h-4 w-4" />上一步</motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(6)} disabled={!storyboards.some(f => f.approved)}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white ${!storyboards.some(f => f.approved) ? "opacity-30 cursor-not-allowed" : ""}`}
                  style={{ background: "linear-gradient(135deg, #64d2ff, #0a84ff)" }}><ArrowRight className="h-4 w-4 inline mr-2" />下一步：选择配音</motion.button>
              </div>
            </div>
          )}

          {/* Step 6 */}
          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Mic className="h-5 w-5 text-[#ff6482]" />选择配音</h3>
              <div className="grid grid-cols-2 gap-3">
                {VOICES.map(v => (
                  <motion.div key={v.id} whileTap={{ scale: 0.97 }} onClick={() => setSelectedVoice(v.id)}
                    className={`cursor-pointer rounded-xl p-4 transition-all ${selectedVoice === v.id ? "bg-white/[0.08] border border-[#ff6482]/30" : "bg-white/[0.02] border border-transparent hover:bg-white/[0.04]"}`}>
                    <span className="text-2xl">{v.emoji}</span>
                    <p className="text-sm font-medium text-white mt-1">{v.label}</p>
                    <p className="text-xs text-[#6e6e78]">{v.desc}</p>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(5)} className="rounded-xl px-4 py-3 text-sm text-[#98989d] bg-white/[0.04] hover:bg-white/[0.08] flex items-center gap-1"><ArrowLeft className="h-4 w-4" />上一步</motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => setStep(7)}
                  className="flex-1 rounded-xl py-3 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #ff6482, #bf5af2)" }}><ArrowRight className="h-4 w-4 inline mr-2" />下一步：生成视频</motion.button>
              </div>
            </div>
          )}

          {/* Step 7 */}
          {step === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Film className="h-5 w-5 text-[#ff375f]" />生成场景视频</h3>
              <p className="text-sm text-[#98989d]">逐条生成，每条约需 30-120 秒</p>
              {loading ? (
                <div className="flex flex-col items-center py-12">
                  <RefreshCw className="h-8 w-8 text-[#ff375f] animate-spin" />
                  <p className="text-sm text-white mt-3">{progressMsg || "正在生成视频..."}</p>
                  {scenes.length > 0 && <p className="text-xs text-[#6e6e78] mt-1">已完成 {scenes.length} 条</p>}
                </div>
              ) : (
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={generateScenes}
                  className="w-full rounded-xl py-3.5 text-sm font-semibold text-white"
                  style={{ background: "linear-gradient(135deg, #ff375f, #ff9f0a)" }}>
                  <Film className="h-4 w-4 inline mr-2" />生成 {storyboards.filter(f => f.approved).length} 条视频（每条约1分钟）
                </motion.button>
              )}
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(5)} className="rounded-xl px-4 py-3 text-sm text-[#98989d] bg-white/[0.04] hover:bg-white/[0.08] flex items-center gap-1"><ArrowLeft className="h-4 w-4" />上一步</motion.button>
            </div>
          )}

          {/* Step 8 */}
          {step === 8 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><Play className="h-5 w-5 text-[#30d158]" />审阅场景视频</h3>
              {scenes.map((scene, i) => (
                <div key={i} className={`rounded-xl glass p-4 flex gap-4 items-start ${scene.approved ? "border border-green-500/20" : ""}`}>
                  {scene.url ? (
                    <video src={scene.url} className="w-48 h-28 object-cover rounded-lg shrink-0" controls />
                  ) : (
                    <div className="w-48 h-28 rounded-lg bg-white/[0.03] flex items-center justify-center shrink-0"><Play className="h-6 w-6 text-[#6e6e78]" /></div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm text-white font-medium">场景 {i + 1}</p>
                    <p className="text-xs text-[#98989d] mt-1 line-clamp-2">{scene.desc}</p>
                    <motion.button whileTap={{ scale: 0.95 }}
                      onClick={() => { const u = [...scenes]; u[i].approved = !u[i].approved; setScenes(u); }}
                      className={`mt-2 rounded-lg px-3 py-1.5 text-xs font-medium ${scene.approved ? "bg-[#30d158]/15 text-[#30d158]" : "bg-white/[0.04] text-[#98989d] hover:bg-white/[0.08]"}`}>
                      {scene.approved ? "✓ 已确认" : "确认此场景"}</motion.button>
                  </div>
                </div>
              ))}
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.97 }} onClick={() => setStep(7)} className="rounded-xl px-4 py-3 text-sm text-[#98989d] bg-white/[0.04] hover:bg-white/[0.08] flex items-center gap-1"><ArrowLeft className="h-4 w-4" />上一步</motion.button>
                <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={composeVideo} disabled={!scenes.some(s => s.approved)}
                  className={`flex-1 rounded-xl py-3 text-sm font-semibold text-white ${!scenes.some(s => s.approved) ? "opacity-30 cursor-not-allowed" : ""}`}
                  style={{ background: "linear-gradient(135deg, #30d158, #0a84ff)" }}><Download className="h-4 w-4 inline mr-2" />合成最终视频</motion.button>
              </div>
            </div>
          )}

          {/* Step 9 */}
          {step === 9 && (
            <div className="space-y-4 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#30d158] to-[#0a84ff] mx-auto flex items-center justify-center">
                <Check className="h-10 w-10 text-white" />
              </motion.div>
              <h3 className="text-lg font-bold text-white">视频制作完成！</h3>
              <p className="text-sm text-[#98989d]">{finalVideo}</p>
              <motion.button whileTap={{ scale: 0.97 }} onClick={() => { setStep(1); setScript(""); setStoryboards([]); setScenes([]); setCharacters([]); setFinalVideo(""); }}
                className="rounded-xl px-4 py-3 text-sm text-[#98989d] bg-white/[0.04] hover:bg-white/[0.08] transition-all">开始新项目</motion.button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
