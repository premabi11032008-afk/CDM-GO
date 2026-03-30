import { useState, useRef, useEffect } from "react";
import { Table, Code, BarChart2, Download, Filter, MoreHorizontal, Maximize2, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { useAppStore } from "@/store/useAppStore";
import { Reorder } from "framer-motion";

export function ResultViewer() {
  const [viewMode, setViewMode] = useState<"table" | "json" | "chart">("table");
  const { queryResult } = useAppStore();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    setItems(queryResult || []);
  }, [queryResult]);

  const containerRef = useRef(null);

  return (
    <div className="flex flex-col h-full bg-card rounded-2xl border border-border/50 cozy-shadow overflow-hidden">
      {/* Header controls */}
      <div className="flex items-center justify-between p-3 border-b border-border/50 bg-muted/10">
        <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border border-border/40">
          <button
            onClick={() => setViewMode("table")}
            className={cn(
              "p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all",
              viewMode === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Table className="w-4 h-4" />
            <span className="hidden sm:inline">Table</span>
          </button>
          <button
            onClick={() => setViewMode("json")}
             className={cn(
              "p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all",
              viewMode === "json" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Code className="w-4 h-4" />
            <span className="hidden sm:inline">JSON</span>
          </button>
          <button
            onClick={() => setViewMode("chart")}
             className={cn(
              "p-1.5 rounded-md flex items-center gap-2 text-sm font-medium transition-all",
              viewMode === "chart" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <BarChart2 className="w-4 h-4" />
            <span className="hidden sm:inline">Chart</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2 font-medium">{items.length} queries returned</span>
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors hover:bg-muted/50">
            <Filter className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors hover:bg-muted/50">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors hover:bg-muted/50">
            <Maximize2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-muted-foreground hover:text-foreground rounded transition-colors hover:bg-muted/50">
             <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div ref={containerRef} className="flex-1 overflow-auto p-4 bg-background/50 relative">
        {viewMode === "table" && (
          <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-6 w-full h-full pb-10">
            {items.length === 0 && (
              <div className="w-full text-center text-muted-foreground p-8">No recent query results. Run a query!</div>
            )}
            
            {items.map((qRes: any, outerIdx: number) => (
              <Reorder.Item 
                key={qRes.statement || String(outerIdx)} 
                value={qRes}
                className="w-full relative rounded-xl border border-border/40 overflow-hidden bg-card shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow z-10 shrink-0"
              >
                <div className="bg-muted px-4 py-2 border-b border-border/60 text-xs font-mono font-semibold text-foreground truncate select-none">
                  {qRes.statement}
                </div>
                
                {qRes.error ? (
                   <div className="p-4 flex flex-col gap-3 bg-red-500/5">
                     <div className="text-red-500 font-mono text-xs break-words whitespace-pre-wrap">{qRes.error}</div>
                     {qRes.aiExplanation && (
                        <div className="text-sm text-foreground bg-card p-3 rounded-lg border border-border/50 shadow-sm flex gap-3 items-start">
                           <Wand2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                           <div className="leading-relaxed opacity-90 break-words w-full overflow-hidden">
                             <div className="font-semibold text-primary mb-1 text-xs uppercase tracking-wider">AI Diagnosis</div>
                             {qRes.aiExplanation}
                           </div>
                        </div>
                     )}
                   </div>
                ) : Array.isArray(qRes.result) && qRes.result.length === 0 ? (
                   <div className="p-4 text-muted-foreground text-sm font-medium">Query executed successfully, but returned 0 rows.</div>
                ) : Array.isArray(qRes.result) ? (
                   <div className="w-full overflow-x-auto select-text">
                     <table className="w-full text-sm text-left text-muted-foreground">
                       <thead className="text-xs uppercase bg-muted/40 border-b border-border/40 text-foreground">
                         <tr>
                           {Object.keys(qRes.result[0]).map((key) => (
                             <th key={key} scope="col" className="px-6 py-3 font-semibold whitespace-nowrap">{key}</th>
                           ))}
                         </tr>
                       </thead>
                       <tbody>
                         {qRes.result.map((row: any, idx: number) => (
                           <tr key={idx} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                             {Object.values(row).map((val: any, jdx: number) => (
                               <td key={jdx} className="px-6 py-3 font-medium text-foreground whitespace-nowrap max-w-[300px] overflow-hidden text-ellipsis">
                                  {typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val)}
                               </td>
                             ))}
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                ) : (
                   <div className="p-4 text-muted-foreground text-sm">Output format unknown.</div>
                )}
              </Reorder.Item>
            ))}
          </Reorder.Group>
        )}

        {viewMode === "json" && (
          <div className="w-full h-full rounded-xl bg-[#282c34] p-4 overflow-auto border border-border/20 cozy-shadow">
            <pre className="text-sm font-mono text-[#abb2bf]">
              <code>
{JSON.stringify(items, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {viewMode === "chart" && (
           <div className="w-full h-full min-h-[300px] flex items-center justify-center pt-4 text-muted-foreground/50">
             Charts currently unsupported for multi-query layout.
          </div>
        )}
      </div>
    </div>
  );
}
