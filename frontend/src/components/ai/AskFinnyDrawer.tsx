import React, { useState, useRef, useEffect } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { api } from '../../services/api';
import { FinnyMessage } from '../../types';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  RefreshCw,
  User
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const AskFinnyView: React.FC = () => {
  const { summary } = useFinance();
  const [messages, setMessages] = useState<FinnyMessage[]>([
    {
      role: 'assistant',
      content: `Hey! I'm Finny, your AI student finance buddy ☕\n\nRight now you have **${formatCurrency(
        summary?.remaining_safe_spend || 0
      )}** remaining for this month, which is about **${formatCurrency(
        summary?.safe_daily_spend || 0
      )}/day**.\n\nAsk me anything: Can you afford an outing this weekend? How to save ₹500? Or why money disappears!`
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [source, setSource] = useState<'gemini' | 'smart_advisor'>('smart_advisor');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sampleQuestions = [
    'Can I afford to go out this weekend?',
    'How can I save ₹500 more this month?',
    'What happens if I save ₹50 every day?',
    'Why am I running out of money so quickly?',
    'How much can I spend on shopping?'
  ];

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isSending) return;

    const userMsg: FinnyMessage = { role: 'user', content: query.trim() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsSending(true);

    try {
      const response = await api.askFinnyChat(query.trim(), messages);
      setMessages((prev) => [...prev, { role: 'assistant', content: response.reply }]);
      setSource(response.source);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "Oops! I couldn't reach my AI brain right now. Make sure the FinHelp backend server is active on port 8000!"
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl bg-violet-100 dark:bg-violet-950 text-violet-600 dark:text-violet-400">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Ask Finny — Your AI Money Buddy
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Personalized advice backed by your real verified numbers. Never hallucinated arithmetic.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <span>Engine: {source === 'gemini' ? 'Google Gemini AI' : 'Smart Student Advisor'}</span>
        </div>
      </div>

      {/* Verified Data Anchor Bar */}
      {summary && (
        <div className="p-3.5 rounded-2xl bg-violet-50/70 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/60 text-xs flex flex-wrap items-center justify-between gap-2">
          <span className="font-bold text-violet-900 dark:text-violet-200 flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-violet-600" />
            <span>Finny is synced with your live finances:</span>
          </span>
          <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300 font-semibold">
            <span>Remaining: {formatCurrency(summary.remaining_safe_spend)}</span>
            <span>•</span>
            <span>Safe Daily: {formatCurrency(summary.safe_daily_spend)}/day</span>
            <span>•</span>
            <span>{summary.days_left} Days Left</span>
          </div>
        </div>
      )}

      {/* Chat Container */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[540px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                m.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.role === 'assistant' && (
                <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0 text-base shadow-xs">
                  🤖
                </div>
              )}

              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-violet-600 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {m.content}
              </div>

              {m.role === 'user' && (
                <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isSending && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0">
                🤖
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-700 rounded-tl-none text-xs text-slate-400 flex items-center space-x-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-violet-500" />
                <span>Finny is crunching your numbers...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-2.5 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/60 dark:bg-slate-800/60 overflow-x-auto flex items-center space-x-2 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Try asking:</span>
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-violet-500 hover:text-violet-600 whitespace-nowrap shrink-0 transition-colors shadow-2xs"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Finny anything (e.g. Can I afford cold coffee today?)"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-violet-500"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="p-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white disabled:opacity-40 transition-all shadow-md shadow-violet-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
