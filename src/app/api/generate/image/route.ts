import { NextResponse } from "next/server";
import { arkTextToImage } from "@/lib/ark";
import { generateImageFlux } from "@/lib/replicate";

export async function POST(req: Request) {
  try {
    const { prompt, width, height, num_outputs, style } = await req.json();

    // 拼接风格 prompt（中文优化）
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
    if (style && styleMap[style]) {
      finalPrompt = `${prompt}，${styleMap[style]}`;
    }

    // 🥇 优先：ARK 即梦（最简单，免费额度）
    if (process.env.ARK_API_KEY) {
      try {
        const result = await arkTextToImage(finalPrompt, {
          width: width || 1024,
          height: height || 1024,
        });
        const images = result.data?.map((d: any) => d.url).filter(Boolean) || [];
        if (images.length > 0) {
          return NextResponse.json({ success: true, images, provider: "即梦 ARK" });
        }
      } catch (e: any) {
        console.log("ARK 失败:", e.message);
      }
    }

    // 🥈 回退：火山引擎 HMAC
    if (process.env.VOLC_ACCESS_KEY && process.env.VOLC_SECRET_KEY) {
      const { jimengTextToImage } = await import("@/lib/volcengine");
      const result = await jimengTextToImage(finalPrompt, { width: width || 1024, height: height || 1024 });
      const images = result.data?.image_urls || [];
      if (images.length > 0) {
        return NextResponse.json({ success: true, images: images.slice(0, num_outputs || 1), provider: "火山引擎" });
      }
    }

    // 🥉 回退：Replicate
    if (process.env.REPLICATE_API_TOKEN) {
      const output = await generateImageFlux(finalPrompt, { width: width || 1024, height: height || 1024, num_outputs: num_outputs || 1 });
      return NextResponse.json({ success: true, images: output, provider: "Replicate" });
    }

    return NextResponse.json(
      { success: false, error: "未配置任何 AI 图片服务" },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "生成失败" },
      { status: 500 }
    );
  }
}
