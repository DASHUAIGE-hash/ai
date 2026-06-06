import { createHash, createHmac } from "crypto";

const REGION = "cn-north-1";
const SERVICE = "visual";
const HOST = "visual.volcengineapi.com";
const API_VERSION = "2022-08-31";

// HMAC-SHA256 签名
function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data).digest();
}

function sha256(data: string): string {
  return createHash("sha256").update(data).digest("hex");
}

function getSignatureKey(
  secretKey: string,
  date: string,
  region: string,
  service: string
): Buffer {
  const kDate = hmac(Buffer.from(secretKey, "utf-8"), date);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  return hmac(kService, "request");
}

async function volcRequest(
  action: string,
  body: Record<string, any>,
  accessKey: string,
  secretKey: string
) {
  const now = new Date();
  const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
  const timestamp = now.toISOString().replace(/\.\d{3}Z$/, "Z");

  const method = "POST";
  const canonicalUri = "/";
  const canonicalQuery = `Action=${action}&Version=${API_VERSION}`;
  const payload = JSON.stringify(body);
  const payloadHash = sha256(payload);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Host": HOST,
    "X-Date": timestamp,
  };

  const signedHeaders = Object.keys(headers).sort().join(";");
  const canonicalHeaders = Object.keys(headers)
    .sort()
    .map((k) => `${k.toLowerCase()}:${headers[k].trim()}`)
    .join("\n");

  const canonicalRequest = [
    method,
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    "",
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateStr}/${REGION}/${SERVICE}/request`;
  const stringToSign = [
    "HMAC-SHA256",
    timestamp,
    credentialScope,
    sha256(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(secretKey, dateStr, REGION, SERVICE);
  const signature = hmac(signingKey, stringToSign).toString("hex");

  headers["Authorization"] =
    `HMAC-SHA256 Credential=${accessKey}/${credentialScope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  const url = `https://${HOST}/?${canonicalQuery}`;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: payload,
  });

  return res.json();
}

/** 即梦文生图 */
export async function jimengTextToImage(
  prompt: string,
  options?: { width?: number; height?: number }
) {
  const ak = process.env.VOLC_ACCESS_KEY;
  const sk = process.env.VOLC_SECRET_KEY;
  if (!ak || !sk) throw new Error("火山引擎密钥未配置");

  const body: Record<string, any> = {
    req_key: "jimeng_t2i_v40",
    prompt,
    width: options?.width || 1024,
    height: options?.height || 1024,
    return_url: true,
  };

  return volcRequest("CVProcess", body, ak, sk);
}

/** 查询即梦任务结果 */
export async function jimengQueryTask(taskId: string) {
  const ak = process.env.VOLC_ACCESS_KEY;
  const sk = process.env.VOLC_SECRET_KEY;
  if (!ak || !sk) throw new Error("火山引擎密钥未配置");

  return volcRequest("CVGetResult", { req_key: "jimeng_t2i_v40", task_id: taskId }, ak, sk);
}
