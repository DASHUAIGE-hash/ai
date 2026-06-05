import { NextResponse } from "next/server";
import { chatCompletion } from "@/lib/deepseek";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const reply = await chatCompletion(messages);
    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "对话失败" },
      { status: 500 }
    );
  }
}
