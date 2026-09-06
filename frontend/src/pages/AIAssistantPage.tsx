import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Train,
  Calculator,
  Compass,
  Lightbulb,
} from 'lucide-react';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'granite';
  text: string;
  timestamp: string;
  model?: string;
  sdgs?: string[];
}

export const AIAssistantPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'granite',
      text: `Greetings! I am the **GreenRoute AI Assistant**, powered by **IBM Granite Foundation Models** (` +
        '`ibm/granite-13b-chat-v2`' +
        `).\n\nI can explain route recommendations, break down your multi-criteria sustainability scores, suggest cleaner alternatives, and provide verified urban transit carbon savings aligned with **SDG 11, 13, and 7**.\n\nHow may I guide your journey today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'ibm/granite-13b-chat-v2',
      sdgs: ['SDG 11: Sustainable Cities', 'SDG 13: Climate Action'],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setLoading(true);

    try {
      const res = await api.ai.chat(textToSend);
      if (res.data?.success) {
        const aiMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'granite',
          text: res.data.data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: res.data.data.model,
          sdgs: res.data.data.sdgAligned,
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'granite',
          text: 'Encountered a connection delay with IBM Granite. Please try your question again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger if prompt param passed from Route Planner
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const promptCards = [
    {
      icon: Train,
      title: 'Why choose Metro?',
      prompt: 'Why should I choose Metro instead of driving a personal car for an 8 km route?',
    },
    {
      icon: Calculator,
      title: 'Explain Score Formula',
      prompt: 'Explain the sustainability score formula and why Carbon has a 40% weight.',
    },
    {
      icon: Lightbulb,
      title: 'Eco Travel Tips',
      prompt: 'What are the top 3 eco-friendly travel tips for reducing urban carbon emissions?',
    },
    {
      icon: Compass,
      title: 'Suburban Alternatives',
      prompt: 'Suggest sustainable transit alternatives for a 20 km suburban commute.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              IBM Granite AI Assistant
              <Sparkles className="w-4 h-4 text-amber-500" />
            </h1>
            <p className="text-xs text-slate-500">
              Zero-bias reasoning for sustainable urban routing & carbon calculations
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
            ibm/granite-13b-chat-v2
          </span>
        </div>
      </div>

      {/* Suggested Quick Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {promptCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <button
              key={i}
              onClick={() => handleSend(card.prompt)}
              className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left hover:border-emerald-500 dark:hover:border-emerald-500 transition group shadow-sm"
            >
              <Icon className="w-4 h-4 text-emerald-600 mb-1.5 group-hover:scale-110 transition-transform" />
              <div className="font-bold text-xs text-slate-800 dark:text-slate-200">{card.title}</div>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{card.prompt}</p>
            </button>
          );
        })}
      </div>

      {/* Conversation Thread Container */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col h-[560px] overflow-hidden">
        {/* Messages List */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}

                {/* SDG Tag pills if AI response */}
                {msg.sdgs && msg.sdgs.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                    {msg.sdgs.map((sdg, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                      >
                        {sdg}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100"></div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200"></div>
              <span className="text-xs font-semibold text-slate-500">
                IBM Granite analyzing transit variables...
              </span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <input
            type="text"
            placeholder="Type your question for IBM Granite (e.g. Why choose Metro?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-600/20 transition"
          >
            <span>Ask Granite</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
