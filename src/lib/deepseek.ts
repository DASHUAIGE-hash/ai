const DEEPSEEK_BASE = "https://api.deepseek.com/v1";

export async function chatCompletion(messages: { role: string; content: string }[]) {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY 未配置");

  const res = await fetch(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error?.message || "DeepSeek 请求失败");
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

export async function translateText(text: string, targetLang: string, sourceLang: string) {
  const langNames: Record<string, string> = {
    en: "English", ja: "Japanese", ko: "Korean", fr: "French",
    de: "German", es: "Spanish", ru: "Russian", zh: "Chinese",
  };
  const prompt = `Translate the following text from ${langNames[sourceLang] || sourceLang} to ${langNames[targetLang] || targetLang}. Only output the translation, nothing else:\n\n${text}`;
  return chatCompletion([{ role: "user", content: prompt }]);
}

export async function documentProcess(text: string, type: "summary" | "ppt" | "writing") {
  const prompts = {
    summary: "请为以下内容生成一份简洁的摘要，提取核心要点：",
    ppt: "请为以下内容生成一份 PPT 大纲，包含标题和每页要点：",
    writing: "请对以下内容进行优化润色，使其更加流畅专业：",
  };
  return chatCompletion([{ role: "user", content: `${prompts[type]}\n\n${text}` }]);
}
