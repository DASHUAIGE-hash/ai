import { NextResponse } from "next/server";
import { agnesAnalyzeImage } from "@/lib/agnes";

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) return NextResponse.json({ success: false, error: "未提供图片" }, { status: 400 });

    const result = await agnesAnalyzeImage(image, "请详细分析这张图片：描述画面内容、提取所有文字、说明颜色和风格。如果是截图，请提取界面中的所有文字。用中文回复。");

    return NextResponse.json({ success: true, reply: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
