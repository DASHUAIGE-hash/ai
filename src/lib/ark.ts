const ARK_BASE = "https://ark.cn-beijing.volces.com/api/v3";

const arkKey = () => process.env.ARK_API_KEY || "";

/** 文生图 — 火山方舟 ARK (即梦 Seedream) */
export async function arkTextToImage(
  prompt: string,
  options?: { width?: number; height?: number }
) {
  const key = arkKey();
  if (!key) throw new Error("ARK_API_KEY 未配置");

  const sizeMap: Record<string, string> = {
    "1024": "1024x1024",
    "768": "768x1024",
    "1280": "1280x720",
    "720": "720x1280",
  };
  const w = options?.width || 1024;
  const h = options?.height || 1024;
  const size = sizeMap[String(w)] || `${w}x${h}`;

  const res = await fetch(`${ARK_BASE}/images/generations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "doubao-seedream-4.0",
      prompt,
      n: 1,
      size,
      response_format: "url",
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.message || `ARK 请求失败 (${res.status})`);
  }
  return data;
}
