const BASE = process.env.AGNES_BASE_URL || "https://apihub.agnes-ai.com/v1";
const KEY = process.env.AGNES_API_KEY || "";

const headers = () => ({
  "Authorization": `Bearer ${KEY}`,
  "Content-Type": "application/json",
});

/** 文生图 / 图生图 */
export async function agnesGenerateImage(
  prompt: string,
  options?: { n?: number; size?: string; referenceImage?: string }
) {
  const body: any = {
    model: "agnes-image-2.1-flash",
    prompt,
    n: options?.n || 1,
    size: options?.size || "1024x1024",
  };
  if (options?.referenceImage) {
    body.image = options.referenceImage;
  }
  const res = await fetch(`${BASE}/images/generations`, {
    method: "POST", headers: headers(), body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Agnes 图片生成失败: ${await res.text()}`);
  const data = await res.json();
  return { urls: data.data?.map((d: any) => d.url).filter(Boolean) || [] };
}

/** 提交视频生成任务 */
export async function agnesSubmitVideo(
  prompt: string,
  options?: { seconds?: number; size?: string; firstFrameImage?: string }
) {
  const body: any = {
    model: "agnes-video-v2.0",
    prompt,
    size: options?.size || "720p",
    seconds: String(options?.seconds || 5),
  };
  if (options?.firstFrameImage) {
    body.image = options.firstFrameImage;
  }
  const res = await fetch(`${BASE}/video/generations`, {
    method: "POST", headers: headers(), body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Agnes 视频提交失败: ${await res.text()}`);
  const data = await res.json();
  return { taskId: data.task_id };
}

/** 查询视频任务 */
export async function agnesCheckVideo(taskId: string) {
  const res = await fetch(`${BASE}/video/generations/${taskId}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(`Agnes 视频查询失败: ${await res.text()}`);
  const json = await res.json();
  // Agnes 嵌套格式: { code, data: { status, data: { url, ... } } }
  const outer = json.data || json;
  const inner = outer.data || outer;
  return {
    status: outer.status || inner.status || "unknown",
    progress: outer.progress || 0,
    videoUrl: inner.url || inner.video_url || inner.output_url || "",
    videoData: inner,
  };
}

/** 识图 / OCR / 图片分析 */
export async function agnesAnalyzeImage(imageBase64: string, question: string) {
  const res = await fetch(`${BASE}/chat/completions`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      model: "agnes-2.0-flash",
      messages: [{
        role: "user",
        content: [
          { type: "text", text: question },
          { type: "image_url", image_url: { url: imageBase64 } },
        ],
      }],
      max_tokens: 2000,
    }),
  });
  if (!res.ok) throw new Error(`Agnes 识图失败: ${await res.text()}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "未识别到内容";
}
