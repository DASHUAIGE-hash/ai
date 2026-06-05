"use client";

import { motion } from "framer-motion";
import { Sparkles, Send, Download, ChevronRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Sparkles,
    title: "输入你的想法",
    desc: "用文字描述你想要的画面，支持中文和英文。不知道怎么写？试试我们的提示词助手，自动帮你优化。",
    color: "#0a84ff",
  },
  {
    number: "02",
    icon: Send,
    title: "AI 开始创作",
    desc: "选择你喜欢的风格和模型，点击生成。AI 将在几秒到几分钟内完成创作，进度实时可见。",
    color: "#5e5ce6",
  },
  {
    number: "03",
    icon: Download,
    title: "下载与分享",
    desc: "满意即可下载高清原图或视频。不满意？换个模型再试一次，直到满意为止。",
    color: "#30d158",
  },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export function HowItWorks() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* 分割线 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-sm text-[#64d2ff]">
            三步开始创作
          </span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl text-white">
            简单到只需三步
          </h2>
          <p className="mt-4 text-base text-[#98989d]">
            无需任何专业技能，像聊天一样简单
          </p>
        </motion.div>

        {/* 步骤 */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-16 grid gap-6 sm:grid-cols-3"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              variants={fadeUp}
              className="relative flex flex-col items-center text-center"
            >
              {/* 连接线 */}
              {i < steps.length - 1 && (
                <div className="absolute top-10 left-[60%] hidden w-full sm:block">
                  <div className="h-px bg-gradient-to-r from-white/10 to-transparent w-full" />
                  <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20" />
                </div>
              )}

              {/* 步骤编号 */}
              <div
                className="relative flex h-20 w-20 items-center justify-center rounded-2xl glass group-hover:border-white/20 transition-all duration-300"
                style={{
                  boxShadow: `0 0 30px ${step.color}10`,
                }}
              >
                <step.icon
                  className="h-8 w-8"
                  style={{ color: step.color }}
                />
                {/* 数字角标 */}
                <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-black border border-white/10 text-[10px] font-bold text-white/60">
                  {step.number}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#98989d] max-w-xs">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
