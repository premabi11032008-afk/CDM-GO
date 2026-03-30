import { useState } from "react";
import { MessageSquare, X, Send, Bot, User, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'bot', text: string}[]>([
    { role: 'bot', text: "Hi! I'm your universal DataNexus AI. Ask me how to format connection strings, write complex SQL queries, or debug errors!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
        const res = await fetch('http://localhost:3001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userMsg })
        });
        const data = await res.json();
        
        if (res.ok) {
            setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
        } else {
            setMessages(prev => [...prev, { role: 'bot', text: `Error: ${data.error}` }]);
        }
    } catch(e) {
        setMessages(prev => [...prev, { role: 'bot', text: "Failed to connect to AI server." }]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[200]">
       {!isOpen && (
          <button 
             onClick={() => setIsOpen(true)}
             className="w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform"
          >
             <MessageSquare className="w-5 h-5" />
          </button>
       )}

       {isOpen && (
          <div className="w-80 md:w-96 bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
             {/* Header */}
             <div className="bg-primary/10 px-4 py-3 flex items-center justify-between border-b border-border/50">
                <div className="flex items-center gap-2 font-semibold text-primary text-sm">
                   <Wand2 className="w-4 h-4" /> DataNexus AI
                </div>
                <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                   <X className="w-4 h-4" />
                </button>
             </div>

             {/* Chat Log */}
             <div className="h-96 overflow-y-auto p-4 flex flex-col gap-3 bg-muted/10">
                {messages.map((msg, idx) => (
                   <div key={idx} className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "self-end items-end" : "self-start items-start")}>
                      <div className={cn("text-xs font-semibold mb-1 opacity-70 flex items-center gap-1", msg.role === 'user' && "flex-row-reverse")}>
                         {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                         {msg.role === 'user' ? 'You' : 'AI Assistant'}
                      </div>
                      <div className={cn("px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap", 
                         msg.role === 'user' ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-card border border-border/40 text-foreground rounded-tl-sm"
                      )}>
                         {msg.text}
                      </div>
                   </div>
                ))}
                {isLoading && (
                   <div className="self-start text-xs text-muted-foreground animate-pulse flex items-center gap-1 mt-1">
                      <Bot className="w-3 h-3" /> Typing...
                   </div>
                )}
             </div>

             {/* Input Layer */}
             <div className="p-3 bg-card border-t border-border/50 flex gap-2">
                <input 
                   type="text"
                   value={input}
                   onChange={e => setInput(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && sendMessage()}
                   placeholder="Ask anything..."
                   className="flex-1 text-sm bg-muted/50 border border-border/40 rounded-lg px-3 py-2 outline-none focus:border-primary/50 text-foreground"
                />
                <button 
                   onClick={sendMessage}
                   disabled={!input.trim() || isLoading}
                   className="bg-primary hover:bg-primary/90 text-primary-foreground p-2 rounded-lg disabled:opacity-50 transition-colors"
                >
                   <Send className="w-4 h-4" />
                </button>
             </div>
          </div>
       )}
    </div>
  );
}
