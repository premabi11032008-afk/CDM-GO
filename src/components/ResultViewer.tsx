import { useState } from "react";
import { Table, Code, BarChart2, Download, Filter, MoreHorizontal, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const mockData = [
  { id: 1, email: "alice@example.com", status: "online", logins: 120 },
  { id: 2, email: "bob@example.com", status: "offline", logins: 45 },
  { id: 3, email: "charlie@example.com", status: "online", logins: 300 },
  { id: 4, email: "dave@example.com", status: "online", logins: 80 },
  { id: 5, email: "eve@example.com", status: "offline", logins: 12 },
];

export function ResultViewer() {
  const [viewMode, setViewMode] = useState<"table" | "json" | "chart">("table");

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
          <span className="text-xs text-muted-foreground mr-2 font-medium">120 rows in 45ms</span>
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
      <div className="flex-1 overflow-auto p-4 bg-background/50">
        {viewMode === "table" && (
          <div className="w-full relative rounded-xl border border-border/40 overflow-hidden bg-card">
            <table className="w-full text-sm text-left text-muted-foreground">
              <thead className="text-xs uppercase bg-muted/40 border-b border-border/40 text-foreground">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold">ID</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Email</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                  <th scope="col" className="px-6 py-3 font-semibold">Logins</th>
                </tr>
              </thead>
              <tbody>
                {mockData.map((row) => (
                  <tr key={row.id} className="border-b border-border/20 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-3">{row.id}</td>
                    <td className="px-6 py-3 font-medium text-foreground">{row.email}</td>
                    <td className="px-6 py-3">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium border",
                        row.status === "online" ? "bg-green-100 text-green-700 border-green-200" : "bg-muted text-muted-foreground border-border/50"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{row.logins}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {viewMode === "json" && (
          <div className="w-full h-full rounded-xl bg-[#282c34] p-4 overflow-auto border border-border/20 cozy-shadow">
            <pre className="text-sm font-mono text-[#abb2bf]">
              <code>
{JSON.stringify(mockData, null, 2)}
              </code>
            </pre>
          </div>
        )}

        {viewMode === "chart" && (
           <div className="w-full h-full min-h-[300px] flex items-center justify-center pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
                <XAxis dataKey="email" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: 'var(--muted)', opacity: 0.4}}
                  contentStyle={{ borderRadius: '0.75rem', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                />
                <Bar dataKey="logins" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
