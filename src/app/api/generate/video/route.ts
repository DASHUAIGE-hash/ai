import { NextResponse } from "next/server";
import { agnesSubmitVideo, agnesCheckVideo } from "@/lib/agnes";

// 提交视频生成
export async function POST(req: Request) {
  try {
    const { prompt, duration, style, action, taskId } = await req.json();

    // 查询任务状态
    if (action === "check" && taskId) {
      const result = await agnesCheckVideo(taskId);
      return NextResponse.json({ success: true, ...result });
    }

    // 提交新任务
    let finalPrompt = prompt;
    const styleMap: Record<string, string> = {
      cinematic: "电影质感，胶片颗粒，专业光影",
      anime: "动漫动画，吉卜力风格，流畅动作",
      realistic: "写实风格，超高清，自然光线",
      fantasy: "奇幻特效，魔法粒子，梦幻光晕",
      "3d": "3D动画，电影级渲染，景深效果",
      vintage: "复古胶片，怀旧色调，颗粒质感",
    };
    if (style && styleMap[style]) finalPrompt = `${prompt}，${styleMap[style]}`;

    const result = await agnesSubmitVideo(finalPrompt, {
      seconds: duration || 5,
      size: "720p",
    });

    return NextResponse.json({
      success: true,
      taskId: result.taskId,
      provider: "Agnes AI",
      message: "视频任务已提交，请轮询查询状态",
    });
  } catch (error: any) {
    console.error("视频生成失败:", error);
    return NextResponse.json(
      { success: false, error: error.message || "生成失败" },
      { status: 500 }
    );
  }
}
