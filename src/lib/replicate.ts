import Replicate from "replicate";

const REPLICATE_MODELS = {
  // 图片生成
  "flux-schnell": "black-forest-labs/flux-schnell",
  "flux-pro": "black-forest-labs/flux-pro",
  // 视频生成
  "wan-video": "wavespeedai/wan-2.1-t2v-480p",
  // 图片编辑
  "gfpgan": "tencentarc/gfpgan",
  "real-esrgan": "nightmareai/real-esrgan",
  // 风格迁移
  "style-transfer": "mcai/stable-diffusion-v2-style",
  // AI写真
  "photomaker": "tencentarc/photomaker",
  // 音乐生成
  "musicgen": "meta/musicgen",
} as const;

let replicate: Replicate | null = null;

export function getReplicate() {
  if (!replicate) {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error("REPLICATE_API_TOKEN 未配置");
    replicate = new Replicate({ auth: token });
  }
  return replicate;
}

/** 生成图片 */
export async function generateImageFlux(prompt: string, options?: {
  width?: number;
  height?: number;
  num_outputs?: number;
  model?: "flux-schnell" | "flux-pro";
}) {
  const rep = getReplicate();
  const model = options?.model || "flux-schnell";
  return rep.run(REPLICATE_MODELS[model] as `${string}/${string}`, {
    input: {
      prompt,
      width: options?.width || 1024,
      height: options?.height || 1024,
      num_outputs: options?.num_outputs || 1,
    },
  });
}

/** 生成视频 */
export async function generateVideoWan(prompt: string, options?: {
  duration?: number;
  width?: number;
  height?: number;
}) {
  const rep = getReplicate();
  return rep.run(REPLICATE_MODELS["wan-video"] as `${string}/${string}`, {
    input: {
      prompt,
      duration: options?.duration || 5,
      width: options?.width || 832,
      height: options?.height || 480,
    },
  });
}

/** 图片高清放大 */
export async function upscaleImage(imageUrl: string, scale: number = 4) {
  const rep = getReplicate();
  return rep.run(REPLICATE_MODELS["real-esrgan"] as `${string}/${string}`, {
    input: { image: imageUrl, scale },
  });
}

/** 音乐生成 */
export async function generateMusic(prompt: string, duration: number = 30) {
  const rep = getReplicate();
  return rep.run(REPLICATE_MODELS["musicgen"] as `${string}/${string}`, {
    input: { prompt, duration },
  });
}
