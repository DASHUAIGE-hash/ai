import { NextResponse } from "next/server";
import { agnesGenerateImage } from "@/lib/agnes";

export async function POST(req: Request) {
  try {
    const { prompt, width, height, num_outputs, style, referenceImage } = await req.json();

    let finalPrompt = prompt;
    const styleMap: Record<string, string> = {
      realistic: "写实摄影风格，超高清，专业摄影，画质清晰",
      anime: "动漫风格，吉卜力画风，色彩鲜艳，线条流畅",
      oil: "油画质感，古典风格，精细笔触，艺术感",
      "3d": "3D渲染，电影级光影，高精度模型，真实材质",
      cyberpunk: "赛博朋克风格，霓虹灯，未来城市，科幻感",
      watercolor: "中国水墨画风，写意山水，留白意境，墨色层次",
      minimal: "极简设计风格，几何构图，柔和色调，干净背景",
      fantasy: "奇幻风格，魔法世界，史诗场景，宏大画面",
    };
    if (style && styleMap[style]) finalPrompt = `${prompt}，${styleMap[style]}`;

    const w = width || 1024;
    const h = height || 1024;
    let size = "1024x1024";
    if (w === 1792 && h === 1024) size = "1792x1024";
    else if (w === 1024 && h === 1792) size = "1024x1792";
    else if (w === 768 && h === 768) size = "768x768";
    else if (w === 512 && h === 512) size = "512x512";

    const result = await agnesGenerateImage(finalPrompt, { n: num_outputs || 1, size, referenceImage });

    return NextResponse.json({
      success: true,
      images: result.urls,
      provider: "Agnes AI",
    });
  } catch (error: any) {
    console.error("图片生成失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "生成失败" },
      { status: 500 }
    );
  }
}
