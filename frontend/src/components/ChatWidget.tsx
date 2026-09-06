import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, CornerDownLeft, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';

interface ChatMessage {
  id: string;
  sender: 'user' | 'granite';
  text: string;
  timestamp: string;
}

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'granite',
      text: 'Hello! I am your **IBM Granite AI Assistant**. Ask me anything about route carbon comparisons, sustainability scores, or eco-friendly transit tips!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (userPrompt?: string) => {
    const messageToSend = userPrompt || input;
    if (!messageToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: messageToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!userPrompt) setInput('');
    setLoading(true);

    try {
      const res = await api.ai.chat(messageToSend);
      if (res.data?.success) {
        const aiMsg: ChatMessage = {
          id: Math.random().toString(),
          sender: 'granite',
          text: res.data.data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'granite',
          text: 'Sorry, I encountered an issue reaching the IBM Granite service. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Why should I choose Metro?',
    'How is sustainability score calculated?',
    'Eco tips for daily commute',
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-xl shadow-emerald-500/25 hover:scale-105 transition-all duration-300"
          aria-label="Open IBM Granite AI Assistant"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
          </div>
          <span className="text-xs font-bold tracking-wide">Ask IBM Granite</span>
        </button>
      )}

      {/* Chat Drawer Dialog */}
      {isOpen && (
        <div className="w-[360px] sm:w-[400px] h-[520px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="p-3.5 bg-gradient-to-r from-emerald-700 to-teal-800 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold flex items-center gap-1.5">
                  IBM Granite AI Assistant
                  <Sparkles className="w-3 h-3 text-amber-300" />
                </h3>
                <p className="text-[10px] text-emerald-200">Powered by Watsonx & Granite 13b</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link
                to="/assistant"
                onClick={() => setIsOpen(false)}
                title="Open Full Screen Assistant"
                className="p-1.5 text-emerald-100 hover:text-white rounded-lg hover:bg-white/10"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-emerald-100 hover:text-white rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs bg-slate-50/50 dark:bg-slate-950/40">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none whitespace-pre-line'
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-fit">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-100"></div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce delay-200"></div>
                <span className="text-[11px] text-slate-500">Granite thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((qp) => (
              <button
                key={qp}
                onClick={() => handleSend(qp)}
                className="whitespace-nowrap text-[10px] px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition"
              >
                {qp}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask Granite about eco travel..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
