import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getChatModel, lunaSystemPrompt, sanitizeMessages } from './settings';

export const runtime = 'nodejs';

export async function POST(req) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key is not configured.' },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Request body must be valid JSON.' },
      { status: 400 }
    );
  }

  const messages = sanitizeMessages(Array.isArray(payload) ? payload : payload?.messages);

  if (messages.length === 0) {
    return NextResponse.json(
      { error: 'At least one message is required.' },
      { status: 400 }
    );
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: getChatModel(),
      messages: [
        { role: 'system', content: lunaSystemPrompt },
        ...messages,
      ],
      stream: true,
    });

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content;

            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }

          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Chat completion failed:', error);

    return NextResponse.json(
      { error: 'LUNA could not generate a response.' },
      { status: 500 }
    );
  }
}
