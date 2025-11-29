// app/api/chat/route.ts
import { google } from '@ai-sdk/google'; // 1. 改用 google SDK
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages, password } = await req.json();

  // 密码验证逻辑保持不变
  if (password !== process.env.SITE_PASSWORD) {
    return new Response('密码错误，请联系网站管理员。', { status: 401 });
  }

  // 2. 调用 Gemini 模型
  const result = await streamText({
    // 这里使用 gemini-1.5-flash，你也可以改成 gemini-1.5-pro
    model: google('gemini-1.5-flash'), 
    messages,
  });

  return result.toDataStreamResponse();
}