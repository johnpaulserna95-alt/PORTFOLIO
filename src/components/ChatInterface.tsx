import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Send, Paperclip, BrainCircuit, Terminal, Construction, Handshake, X, MessageSquare } from 'lucide-react';
import { ai, SYSTEM_PROMPT } from '../services/gemini';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Greetings! I am the Aether Intelligence interface for John Paul Serna. I've been trained on his BS IT background and experience in software testing and cold-calling. How can I help you navigate his expertise today? 🤖",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, isOpen]);

  const handleSend = async (text: string = input) => {
    const trimmedText = text.trim();
    if (!trimmedText || isTyping) return;

    const userMsg: Message = { role: 'user', content: trimmedText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    if (!ai) {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          role: 'ai',
          content: "I'm currently in offline mode (API key missing), but I can tell you that John is an expert in AI Automation and QA Testing!",
          timestamp: new Date()
        }]);
        setIsTyping(false);
      }, 1000);
      return;
    }

    try {
      const chat = ai.chats.create({
        model: "gemini-3-flash-preview",
        config: { systemInstruction: SYSTEM_PROMPT }
      });
      
      const response = await chat.sendMessage({ message: trimmedText });
      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.text || "I'm processing that request...",
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: "I encountered a glitch in the neural link. Please try again.",
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const suggestions = [
    { text: "Show me your best projects", icon: <Terminal size={14} /> },
    { text: "What tools do you use?", icon: <Construction size={14} /> },
    { text: "How can we collaborate?", icon: <Handshake size={14} /> },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[1000] w-16 h-16 rounded-full bg-primary text-black flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.3)] primary-glow"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(10px)' }}
            className="fixed bottom-28 right-8 z-[1000] w-[calc(100vw-4rem)] md:w-[450px] h-[600px] max-h-[calc(100vh-10rem)] liquid-glass rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-border"
          >
            {/* Header */}
            <div className="p-6 border-b border-border bg-surface-container-low flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <BrainCircuit size={24} />
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Aether Intelligence</h3>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">Neural Link Active</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col gap-2",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-4 rounded-2xl max-w-[90%] text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-primary text-black rounded-tr-none font-medium" 
                      : "bg-surface-container-high border border-border rounded-tl-none text-on-surface/90"
                  )}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase px-1 tracking-widest">
                    {msg.role === 'user' ? 'Visitor' : 'Aether'} • {i === 0 ? 'Now' : 'Just now'}
                  </span>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-3 px-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full dot-typing" style={{ animationDelay: '0s' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full dot-typing" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full dot-typing" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            <div className="px-6 py-2 flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(s.text)}
                  className="px-3 py-1.5 rounded-full bg-surface-container-low border border-border text-[10px] font-mono text-primary hover:bg-primary/10 transition-colors flex items-center gap-1.5"
                >
                  {s.icon} {s.text}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-6 pt-2">
              <div className="relative flex items-center bg-surface-container-highest rounded-2xl border border-border p-1.5 pr-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Message Aether..."
                  className="w-full bg-transparent border-none text-on-surface placeholder:text-neutral-500 focus:ring-0 text-sm py-3 px-3"
                />
                <button 
                  onClick={() => handleSend()}
                  disabled={isTyping || !input.trim()}
                  className="bg-primary hover:opacity-90 text-black p-2.5 rounded-xl transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
