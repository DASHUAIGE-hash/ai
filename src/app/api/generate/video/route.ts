import { NextResponse } from "next/server";
import { generateVideoWan } from "@/lib/replicate";

export async function POST(req: Request) {
  try {
    const { prompt, duration, style } = await req.json();

    let finalPrompt = prompt;
    if (style) {
      const styleMap: Record<string, string> = {
        cinematic: "cinematic, film grain, professional lighting, 24fps",
        anime: "anime animation, studio ghibli style, smooth motion",
        realistic: "photorealistic, 8k, natural lighting, realistic motion",
        fantasy: "fantasy, magical particles, ethereal glow, dreamlike",
        "3d": "3D animation, octane render, smooth keyframes, depth of field",
        vintage: "vintage film, super 8mm, grainy, retro color grading",
      };
      if (styleMap[style]) {
        finalPrompt = `${prompt}, ${styleMap[style]}`;
      }
    }

    const output = await generateVideoWan(finalPrompt, {
      duration: duration || 5,
    });

    return NextResponse.json({ success: true, video: output });
  } catch (error: any) {
    console.error("视频生成失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "生成失败" },
      { status: 500 }
    );
  }
}
