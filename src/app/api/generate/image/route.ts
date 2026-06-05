import { NextResponse } from "next/server";
import { generateImageFlux } from "@/lib/replicate";

export async function POST(req: Request) {
  try {
    const { prompt, width, height, num_outputs, style } = await req.json();

    // 拼接风格 prompt
    let finalPrompt = prompt;
    if (style) {
      const styleMap: Record<string, string> = {
        realistic: "photorealistic, 8k, professional photography, detailed",
        anime: "anime style, studio ghibli, vibrant colors, clean lines",
        oil: "oil painting, classical, detailed brushstrokes, canvas texture",
        "3d": "3D render, octane render, cinematic lighting, ray tracing",
        cyberpunk: "cyberpunk, neon lights, futuristic city, blade runner aesthetic",
        watercolor: "chinese ink wash painting, misty mountains, traditional sumi-e",
        minimal: "minimalist design, clean geometric, pastel colors, simple composition",
        fantasy: "fantasy art, magical, epic scene, intricate details, dramatic lighting",
      };
      if (styleMap[style]) {
        finalPrompt = `${prompt}, ${styleMap[style]}`;
      }
    }

    const output = await generateImageFlux(finalPrompt, {
      width: width || 1024,
      height: height || 1024,
      num_outputs: num_outputs || 1,
    });

    return NextResponse.json({ success: true, images: output });
  } catch (error: any) {
    console.error("图片生成失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "生成失败" },
      { status: 500 }
    );
  }
}
