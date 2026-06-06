# 🫘 豆角 — AI 多元化创作平台

AI 驱动的智能创作平台，支持 AI 图片生成、视频生成、智能对话、文档处理等 9 大功能。

## 🚀 如何运行（老师请看这里）

### 方式一：双击启动（最简单）

1. 下载项目 → 解压到任意文件夹
2. 确保电脑已安装 [Node.js](https://nodejs.org)（如未安装，先安装）
3. 双击 `启动演示.bat`
4. 浏览器自动打开 `http://localhost:3000`

### 方式二：命令行

```bash
cd 豆角智能体
npm install
npm run start
# 浏览器访问 http://localhost:3000
```

## 🛠 技术栈

- **框架**：Next.js 16 + React 19 + TypeScript
- **样式**：Tailwind CSS 4 + 自定义设计系统
- **动效**：Framer Motion
- **AI 引擎**：DeepSeek（对话/翻译/文档）
- **PPT 导出**：PptxGenJS

## 📄 页面结构

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | `/` | Hero + 吉祥物 + 工具矩阵 |
| 图片生成 | `/generate/image` | 文生图，8 种风格 |
| 视频生成 | `/generate/video` | 文生视频 + 图生视频 |
| 作品画廊 | `/gallery` | 瀑布流展示 |
| 智能对话 | `/tools/ai-chat` | DeepSeek 驱动 |
| 智能翻译 | `/tools/translate` | 8 语言互译 |
| 文档助手 | `/tools/document` | 摘要/PPT/写作 |
| 图片编辑 | `/tools/image-editor` | 抠图/放大/修复 |
| 风格迁移 | `/tools/style-transfer` | 8 种艺术风格 |
| AI 写真 | `/tools/ai-portrait` | 专业写真生成 |
| 音乐生成 | `/tools/music-gen` | 情绪化谱曲 |
