import { Search, Command, Mic } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

export function GlobalSearch() {
  const { searchQuery, setSearchQuery } = useAppStore();

  return (
    <div className="w-full max-w-2xl mx-auto flex items-center justify-center p-4">
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
    </div>
  );
}
