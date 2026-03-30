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
  const { activeQueryTab, setActiveQueryTab, activeDatabase, setQueryResult, searchQuery, setSearchQuery } = useAppStore();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleAiSubmit = async () => {
     if (!aiPrompt.trim()) return;
     setIsAiLoading(true);
     try {
        const res = await fetch('http://localhost:3001/api/suggest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: aiPrompt })
        });
        const data = await res.json();
        if (res.ok) {
            setSearchQuery(searchQuery + (searchQuery.trim() ? '\n\n' : '') + data.suggestion);
            setIsAiModalOpen(false);
            setAiPrompt("");
        } else {
            alert("AI Error:\n" + data.error);
        }
     } catch (e) {
         alert("Failed to reach AI Server.");
     } finally {
         setIsAiLoading(false);
     }
  };

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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Type your query here..."
          spellCheck={false}
        />
        
        {/* Floating AI Helper */}
        <button 
          onClick={() => setIsAiModalOpen(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-background border border-border/50 text-muted-foreground cozy-shadow rounded-full px-4 py-2 text-sm font-medium hover:text-primary hover:border-primary/30 transition-all opacity-0 group-hover:opacity-100"
        >
          <Wand2 className="w-4 h-4" />
          Ask AI Suggestion
        </button>
      </div>

      {isAiModalOpen && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-card border border-border/50 rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Ask AI for a Query</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Describe what you want to extract from your database, and Gemini will automatically write the precise SQL for you.
            </p>
            <textarea
              className="w-full h-24 p-3 rounded-lg border border-border/50 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm mb-4"
              placeholder="e.g. Show me the top 10 most recent active users..."
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
            />
            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsAiModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
              <button 
                disabled={isAiLoading || !aiPrompt.trim()}
                onClick={handleAiSubmit}
                className="px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isAiLoading ? "Generating..." : "Generate SQL"}
                <Wand2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

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
        <button
          onClick={async () => {
            if (!searchQuery.trim()) return;
            setQueryResult(null); // clear previous results
            try {
              const res = await fetch('http://localhost:3001/api/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery })
              });
              const json = await res.json();
              
              if (res.ok) {
                // Backend returns an array of result sets: [{ statement, result, error }]
                setQueryResult(Array.isArray(json) ? json : [json]);
              } else {
                alert('Database Error:\n' + json.error);
                setQueryResult(null);
              }
            } catch (error) {
              console.error('Failed to execute query', error);
              setQueryResult(null);
            }
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium shadow-sm shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
        >
          <Play className="w-4 h-4" />
          Run Query
        </button>
      </div>
    </div>
  );
}
