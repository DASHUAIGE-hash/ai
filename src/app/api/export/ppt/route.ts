import { NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    const pptx = new PptxGenJS();
    pptx.layout = "LAYOUT_WIDE";
    pptx.author = "豆角 AI";
    pptx.title = "AI 生成演示文稿";

    const lines: string[] = content.split("\n");
    const slides: { title: string; bullets: string[] }[] = [];
    let currentSlide: { title: string; bullets: string[] } | null = null;

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const titleMatch = trimmed.match(
        /^(?:#{2,4}\s*|第[一二三四五六七八九十\d]+[页部分]|幻灯片\s*\d+[：:]|(?:\d+[\.、．]\s*))(.+)/
      );
      if (titleMatch && !trimmed.startsWith("-") && !trimmed.startsWith("*")) {
        if (currentSlide) slides.push(currentSlide);
        currentSlide = { title: titleMatch[1].replace(/^[#\s]+/, "").trim(), bullets: [] };
      } else if (currentSlide && (trimmed.startsWith("-") || trimmed.startsWith("*") || trimmed.match(/^[•·▪▸]/))) {
        currentSlide.bullets.push(trimmed.replace(/^[-*•·▪▸]\s*/, "").trim());
      } else if (currentSlide && trimmed.length > 10) {
        currentSlide.bullets.push(trimmed);
      }
    }
    if (currentSlide) slides.push(currentSlide);
    if (slides.length === 0) {
      slides.push({ title: "AI 生成大纲", bullets: content.split("\n").filter((l: string) => l.trim()) });
    }

    // 封面
    const cover = pptx.addSlide();
    cover.background = { fill: "0a0a0a" };
    cover.addText("AI 生成演示文稿", { x: 1, y: 1.5, w: 8, h: 1.5, fontSize: 36, bold: true, color: "FFFFFF", fontFace: "Microsoft YaHei" });
    cover.addText(new Date().toLocaleDateString(), { x: 1, y: 3.2, w: 8, h: 0.5, fontSize: 14, color: "AAAAAA" });
    cover.addText("由 豆角 AI 生成", { x: 1, y: 3.8, w: 8, h: 0.5, fontSize: 12, color: "666666" });

    // 内容页
    for (const slide of slides) {
      const s = pptx.addSlide();
      s.background = { fill: "0a0a0f" };
      s.addText(slide.title, { x: 0.8, y: 0.5, w: 8.4, h: 0.8, fontSize: 24, bold: true, color: "64d2ff" });
      s.addShape(pptx.ShapeType.rect, { x: 0.8, y: 1.4, w: 1, h: 0.04, fill: { color: "64d2ff" } });
      if (slide.bullets.length > 0) {
        s.addText(
          slide.bullets.map((b) => ({ text: b, options: { bullet: true, fontSize: 16, color: "CCCCCC", breakType: "none" } })),
          { x: 1, y: 1.8, w: 8, h: 4, lineSpacing: 32 }
        );
      }
    }

    // 使用 write 返回 base64，再用 Buffer 转换
    const base64 = await pptx.write({ outputType: "base64" });
    const buffer = Buffer.from(base64 as string, "base64");

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(`豆角PPT_${new Date().toLocaleDateString()}.pptx`)}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
