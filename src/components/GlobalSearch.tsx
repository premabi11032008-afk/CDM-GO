import { Search, Command, Mic, Clock } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useState, useEffect } from "react";

export function GlobalSearch() {
  const { searchQuery, setSearchQuery } = useAppStore();
  const [history, setHistory] = useState<any[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (isFocused) {
      fetch('http://localhost:3001/api/history')
        .then(res => res.json())
        .then(data => setHistory(data))
        .catch(console.error);
    }
  }, [isFocused]);

  const filtered = history.filter(h => h.query.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center p-4 relative z-50">
      <div className="relative w-full group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          className="block w-full h-14 pl-12 pr-24 rounded-full border-2 border-border/50 bg-background shadow-sm 
                     focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all duration-300
                     text-base placeholder-muted-foreground font-medium"
          placeholder="Ask anything... e.g. 'Show sales from MySQL and MongoDB'"
          value={searchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        {/* Helper Actions */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
           <button className="p-2 rounded-full text-muted-foreground hover:bg-muted/80 transition-colors hidden sm:block">
            <Mic className="w-4 h-4" />
          </button>
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded bg-muted/50 border border-border/60 text-xs font-semibold text-muted-foreground mr-1">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* History Dropdown Overlay */}
      {isFocused && filtered.length > 0 && (
        <div className="absolute top-[80px] w-full max-w-2xl bg-card border border-border/50 rounded-xl shadow-lg overflow-hidden max-h-64 overflow-y-auto">
          {filtered.map((item, idx) => (
            <div 
              key={idx} 
              onMouseDown={() => setSearchQuery(item.query)}
              className="px-4 py-3 hover:bg-muted/50 cursor-pointer border-b border-border/20 flex items-start gap-3 transition-colors"
            >
              <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground line-clamp-2">{item.query}</span>
                <span className="text-xs text-muted-foreground mt-1">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
