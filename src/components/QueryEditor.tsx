import { useState } from "react";
import { Play, Share, History, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";

const tabs = [
  { id: "query-1", name: "users_active.sql" },
  { id: "query-2", name: "sales_mongo.json" },
  { id: "query-3", name: "Untitled Query" },
];

export function QueryEditor() {
  const { activeQueryTab, setActiveQueryTab, activeDatabase } = useAppStore();
  const [queryContent, setQueryContent] = useState(
    "SELECT \n  user_id,\n  email,\n  last_login \nFROM active_users \nWHERE status = 'online'\nORDER BY last_login DESC\nLIMIT 100;"
  );

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border/50 cozy-shadow overflow-hidden">
      {/* Editor Header / Tabs */}
      <div className="flex items-center justify-between border-b border-border/50 bg-muted/20 px-2 overflow-x-auto no-scrollbar">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveQueryTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeQueryTab === tab.id
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              {tab.name}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 px-2 shrink-0">
           <span className="text-xs font-medium px-2 py-1 rounded bg-secondary text-secondary-foreground border border-border/50">
             {activeDatabase ? activeDatabase.toUpperCase() : "NO DB"}
           </span>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="relative flex-1 p-4 font-mono text-sm leading-relaxed overflow-auto group">
        <textarea
          className="w-full h-full bg-transparent resize-none outline-none text-foreground placeholder-muted-foreground/50"
          value={queryContent}
          onChange={(e) => setQueryContent(e.target.value)}
          placeholder="Type your query here..."
          spellCheck={false}
        />
        
        {/* Floating AI Helper */}
        <button className="absolute bottom-4 right-4 flex items-center gap-2 bg-background border border-border/50 text-muted-foreground cozy-shadow rounded-full px-4 py-2 text-sm font-medium hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100">
          <Wand2 className="w-4 h-4" />
          Ask AI Suggestion
        </button>
      </div>

      {/* Editor Footer Actions */}
      <div className="flex items-center justify-between p-3 border-t border-border/50 bg-muted/20">
        <div className="flex gap-2">
          <button className="p-2 text-muted-foreground hover:text-foreground rounded transition-colors hover:bg-muted/50">
            <History className="w-4 h-4" />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground rounded transition-colors hover:bg-muted/50">
            <Share className="w-4 h-4" />
          </button>
        </div>
        <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95">
          <Play className="w-4 h-4" />
          Run Query
        </button>
      </div>
    </div>
  );
}
