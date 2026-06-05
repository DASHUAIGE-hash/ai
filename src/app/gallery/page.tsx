"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Image,
  Video,
  Play,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Download,
  Eye,
  Clock,
  X,
} from "lucide-react";

/* ── Mock 作品数据 ── */
const MOCK_WORKS = [
  {
    id: "1",
    type: "image" as const,
    prompt: "一只戴着宇航员头盔的柴犬，漂浮在外太空，周围有五彩斑斓的星云，超现实主义风格",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop",
    date: "2 小时前",
    model: "Flux Pro",
  },
  {
    id: "2",
    type: "image" as const,
    prompt: "赛博朋克风格的东京夜景，霓虹灯倒映在雨后的街道上，电影级光影",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=800&fit=crop",
    date: "5 小时前",
    model: "Flux Pro",
  },
  {
    id: "3",
    type: "video" as const,
    prompt: "一只猫在樱花树下漫步，微风拂过，花瓣飘落",
    image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=600&h=400&fit=crop",
    date: "昨天",
    model: "Kling 3.0",
    duration: "5s",
  },
  {
    id: "4",
    type: "image" as const,
    prompt: "极简风格的建筑摄影，白色混凝土几何体在清晨阳光下的光影层次",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&h=800&fit=crop",
    date: "昨天",
    model: "DALL-E 3",
  },
  {
    id: "5",
    type: "image" as const,
    prompt: "油画质感的静物花卉，凡高风格的笔触和色彩，温暖的金黄色调",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&h=600&fit=crop",
    date: "2 天前",
    model: "Flux Pro",
  },
  {
    id: "6",
    type: "video" as const,
    prompt: "海浪拍打礁石的慢动作镜头，夕阳逆光",
    image: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&h=400&fit=crop",
    date: "3 天前",
    model: "Kling 3.0",
    duration: "10s",
  },
  {
    id: "7",
    type: "image" as const,
    prompt: "水墨风格的黄山云海，松树剪影，留白意境",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop",
    date: "4 天前",
    model: "SDXL",
  },
  {
    id: "8",
    type: "image" as const,
    prompt: "3D 渲染的水晶鹿在魔法森林中，发光粒子漂浮",
    image: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&h=600&fit=crop",
    date: "5 天前",
    model: "Flux Pro",
  },
  {
    id: "9",
    type: "image" as const,
    prompt: "复古胶片质感的街头摄影，东京涉谷十字路口，雨天",
    image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&h=800&fit=crop",
    date: "1 周前",
    model: "SDXL",
  },
];

type Filter = "all" | "image" | "video";

export default function GalleryPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedWork, setSelectedWork] = useState<(typeof MOCK_WORKS)[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_WORKS.filter((w) => {
    if (filter !== "all" && w.type !== filter) return false;
    if (searchQuery && !w.prompt.toLowerCase().includes(searchQuery.toLowerCase()))
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* 顶部 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ff9f0a]/10">
              <Sparkles className="h-5 w-5 text-[#ff9f0a]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">作品画廊</h1>
              <p className="text-sm text-[#98989d]">浏览所有 AI 生成的图片和视频作品</p>
            </div>
          </div>

          {/* 搜索 + 筛选 */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* 搜索框 */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6e6e78]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索作品描述..."
                className="w-full rounded-xl bg-white/[0.04] border border-white/[0.08] pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-[#6e6e78] focus:outline-none focus:border-white/[0.15] transition-all"
              />
            </div>

            {/* 类型筛选 */}
            <div className="flex gap-1 p-1 rounded-xl glass">
              {[
                { key: "all", label: "全部", icon: Grid3X3 },
                { key: "image", label: "图片", icon: Image },
                { key: "video", label: "视频", icon: Video },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as Filter)}
                  className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    filter === key
                      ? "bg-white/10 text-white"
                      : "text-[#98989d] hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 作品网格 */}
        <motion.div
          layout
          className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((work, i) => (
              <motion.div
                key={work.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="break-inside-avoid"
              >
                <div
                  className="group relative overflow-hidden rounded-2xl glass cursor-pointer hover:border-white/[0.12] transition-all duration-300"
                  onClick={() => setSelectedWork(work)}
                >
                  {/* 图片 */}
                  <div className="relative overflow-hidden">
                    <img
                      src={work.image}
                      alt={work.prompt}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      style={{
                        aspectRatio: work.type === "video" ? "16/9" : "1/1",
                      }}
                    />

                    {/* 视频播放按钮 */}
                    {work.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                          <Play className="h-6 w-6 text-white ml-1" />
                        </div>
                        {work.duration && (
                          <span className="absolute bottom-2 right-2 rounded-lg bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs text-white">
                            {work.duration}
                          </span>
                        )}
                      </div>
                    )}

                    {/* 类型标签 */}
                    <span className="absolute top-2 left-2 rounded-lg bg-black/60 backdrop-blur-sm px-2 py-0.5 text-xs text-white flex items-center gap-1">
                      {work.type === "video" ? (
                        <Video className="h-3 w-3" />
                      ) : (
                        <Image className="h-3 w-3" />
                      )}
                      {work.type === "video" ? "视频" : "图片"}
                    </span>
                  </div>

                  {/* 底部信息 */}
                  <div className="p-4">
                    <p className="text-sm text-white line-clamp-2 leading-relaxed">
                      {work.prompt}
                    </p>
                    <div className="flex items-center gap-3 mt-2.5 text-xs text-[#6e6e78]">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {work.date}
                      </span>
                      <span className="text-[#6e6e78]/50">·</span>
                      <span>{work.model}</span>
                    </div>
                  </div>

                  {/* hover 遮罩 */}
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <span className="rounded-lg bg-white/15 backdrop-blur-sm px-3 py-1.5 text-xs text-white flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5" />
                        查看详情
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* 空状态 */}
        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-4"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.03]">
              <Search className="h-8 w-8 text-[#6e6e78]" />
            </div>
            <p className="text-[#98989d] font-medium">
              {searchQuery ? "没有找到匹配的作品" : "还没有作品"}
            </p>
            <p className="text-sm text-[#6e6e78]">
              {searchQuery ? "试试其他关键词" : "去生成你的第一张 AI 作品吧"}
            </p>
          </motion.div>
        )}
      </div>

      {/* ── 作品详情弹窗 ── */}
      <AnimatePresence>
        {selectedWork && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setSelectedWork(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl glass-lg bg-[#111118] border border-white/10"
            >
              {/* 关闭按钮 */}
              <button
                onClick={() => setSelectedWork(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* 图片 */}
              <div className="relative">
                <img
                  src={selectedWork.image}
                  alt={selectedWork.prompt}
                  className="w-full object-cover max-h-[50vh]"
                />
                {selectedWork.type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm cursor-pointer">
                      <Play className="h-7 w-7 text-white ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* 详情 */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="rounded-lg bg-[#0a84ff]/15 px-2.5 py-1 text-xs text-[#0a84ff]">
                    {selectedWork.type === "video" ? "视频" : "图片"}
                  </span>
                  <span className="rounded-lg bg-white/[0.04] px-2.5 py-1 text-xs text-[#98989d]">
                    {selectedWork.model}
                  </span>
                  <span className="text-xs text-[#6e6e78] flex items-center gap-1 ml-auto">
                    <Clock className="h-3 w-3" />
                    {selectedWork.date}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">提示词</h3>
                <p className="text-sm text-[#98989d] leading-relaxed bg-white/[0.03] rounded-xl p-4 border border-white/[0.05]">
                  {selectedWork.prompt}
                </p>

                <div className="flex items-center gap-3 mt-6">
                  <button className="flex items-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] px-5 py-2.5 text-sm text-white transition-colors">
                    <Download className="h-4 w-4" />
                    下载
                  </button>
                  <button className="flex items-center gap-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] px-5 py-2.5 text-sm text-white transition-colors">
                    <Sparkles className="h-4 w-4" />
                    复用提示词
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
