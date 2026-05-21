'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { BookOpen, Bot, Gamepad2, Globe2, Loader2, Send, Sparkles } from 'lucide-react';

const starterPrompts = [
  'Explain black holes like I am new to physics.',
  'What makes Mars different from Earth?',
  'How do satellites stay in orbit?',
  'Give me a 5-minute lesson on exoplanets.',
];

function normalizeTopic(value) {
  if (!value) {
    return '';
  }

  return value
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function MessageContent({ content }) {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5">{children}</ul>,
        ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5">{children}</ol>,
        li: ({ children }) => <li className="leading-7">{children}</li>,
        h1: ({ children }) => <h1 className="mb-3 text-2xl font-black text-white">{children}</h1>,
        h2: ({ children }) => <h2 className="mb-3 text-xl font-black text-white">{children}</h2>,
        h3: ({ children }) => <h3 className="mb-2 text-lg font-black text-white">{children}</h3>,
        code: ({ inline, children }) =>
          inline ? (
            <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-cyan-100">{children}</code>
          ) : (
            <pre className="my-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-4">
              <code className="font-mono text-sm text-cyan-50">{children}</code>
            </pre>
          ),
        blockquote: ({ children }) => (
          <blockquote className="my-3 border-l-2 border-cyan-200/60 bg-cyan-300/10 py-2 pl-4 text-cyan-50">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="font-bold text-cyan-100 underline-offset-4 hover:underline">
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I am Luna. Ask me a space or science question and I will keep the answer focused, clear, and useful.',
    },
  ]);
  const [input, setInput] = useState('');
  const [topicLabel, setTopicLabel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const topic = normalizeTopic(params.get('topic'));
    if (topic) {
      setTopicLabel(topic);
      setMessages([
        {
          role: 'assistant',
          content: `I am ready to explore ${topic}. Ask for an explanation, a quick quiz, a real-world example, or a step-by-step walkthrough.`,
        },
      ]);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  const promptIntro = useMemo(() => {
    if (topicLabel) {
      return `Mission context: ${topicLabel}`;
    }

    return 'Science-only chat';
  }, [topicLabel]);

  async function sendMessage(overrideText) {
    const text = (overrideText ?? input).trim();

    if (!text || isLoading) {
      return;
    }

    const outboundMessages = [...messages, { role: 'user', content: text }];
    setInput('');
    setIsLoading(true);
    setMessages([...outboundMessages, { role: 'assistant', content: '' }]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(outboundMessages),
      });

      if (!response.ok || !response.body) {
        throw new Error('Chat request failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const chunk = decoder.decode(value, { stream: true });
        setMessages((currentMessages) => {
          const nextMessages = [...currentMessages];
          const last = nextMessages[nextMessages.length - 1];
          nextMessages[nextMessages.length - 1] = {
            ...last,
            content: `${last.content}${chunk}`,
          };
          return nextMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((currentMessages) => {
        const nextMessages = [...currentMessages];
        nextMessages[nextMessages.length - 1] = {
          role: 'assistant',
          content: 'I could not reach Luna right now. Check the API key or try again in a moment.',
        };
        return nextMessages;
      });
    } finally {
      setIsLoading(false);
      textareaRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <main className="luna-page pb-28 pt-20 md:pb-10 md:pt-24">
      <section className="luna-container grid min-h-[calc(100svh-8rem)] gap-6 lg:grid-cols-[0.34fr_0.66fr]">
        <aside className="space-panel self-start p-5">
          <div className="eyebrow flex items-center gap-2">
            <Bot size={15} />
            Luna Chat
          </div>
          <h1 className="mt-4 text-3xl font-black leading-tight text-white">Ask better science questions.</h1>
          <p className="mt-3 text-sm leading-6 text-[var(--space-muted)]">
            Luna is constrained to space and science, so the conversation stays aligned with the learning platform.
          </p>

          <div className="mt-5 rounded-lg border border-cyan-300/20 bg-cyan-300/10 p-4">
            <div className="flex items-center gap-2 text-sm font-black text-cyan-50">
              <Sparkles size={16} />
              {promptIntro}
            </div>
          </div>

          <div className="mt-5 grid gap-2">
            {starterPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => setInput(prompt)}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left text-sm font-semibold leading-6 text-[var(--space-muted)] transition hover:border-cyan-300/25 hover:text-white"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2">
            <Link href="/learn" className="space-card grid place-items-center gap-2 p-3 text-center text-xs font-bold text-[var(--space-muted)] hover:text-white">
              <BookOpen size={18} />
              Learn
            </Link>
            <Link href="/games" className="space-card grid place-items-center gap-2 p-3 text-center text-xs font-bold text-[var(--space-muted)] hover:text-white">
              <Gamepad2 size={18} />
              Games
            </Link>
            <Link href="/globe" className="space-card grid place-items-center gap-2 p-3 text-center text-xs font-bold text-[var(--space-muted)] hover:text-white">
              <Globe2 size={18} />
              Globe
            </Link>
          </div>
        </aside>

        <section className="flex min-h-[70svh] flex-col">
          <div className="space-panel flex-1 overflow-hidden">
            <div className="border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-black text-white">Conversation</div>
                  <div className="text-xs font-semibold text-[var(--space-muted)]">{messages.length} messages</div>
                </div>
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-100">
                    <Loader2 size={14} className="animate-spin" />
                    Thinking
                  </div>
                )}
              </div>
            </div>

            <div className="max-h-[calc(100svh-18rem)] min-h-[420px] overflow-y-auto px-4 py-5 sm:px-5">
              <div className="space-y-4">
                {messages.map((message, index) => {
                  const isUser = message.role === 'user';

                  return (
                    <div key={`${message.role}-${index}`} className={isUser ? 'flex justify-end' : 'flex justify-start'}>
                      <article
                        className={[
                          'max-w-[88%] rounded-lg border p-4 text-sm leading-7 sm:max-w-[76%]',
                          isUser
                            ? 'border-amber-300/25 bg-amber-300/10 text-white'
                            : 'border-cyan-300/20 bg-white/[0.045] text-[var(--space-muted)]',
                        ].join(' ')}
                      >
                        <div className="mb-2 text-xs font-black uppercase tracking-[0.12em] text-white">
                          {isUser ? 'You' : 'Luna'}
                        </div>
                        {message.content ? (
                          <MessageContent content={message.content} />
                        ) : (
                          <div className="flex items-center gap-2 text-cyan-100">
                            <Loader2 size={15} className="animate-spin" />
                            Drafting response
                          </div>
                        )}
                      </article>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="sticky bottom-24 mt-4 rounded-lg border border-white/10 bg-[#080b12]/90 p-3 shadow-2xl backdrop-blur-xl md:bottom-5">
            <label className="sr-only" htmlFor="luna-message">
              Message Luna
            </label>
            <div className="flex gap-2">
              <textarea
                ref={textareaRef}
                id="luna-message"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask a space or science question..."
                rows={1}
                className="field max-h-32 min-h-[48px] resize-none"
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="space-button min-w-12 px-3 disabled:cursor-not-allowed disabled:opacity-55">
                <Send size={18} />
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
