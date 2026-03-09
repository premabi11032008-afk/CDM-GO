import { Database, Clock, Star, Hexagon, Server, Activity, ChevronRight, X } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const connectors = [
  { id: "mysql", name: "Production MySQL", type: "SQL", icon: Database, status: "online" },
  { id: "mongo", name: "Events MongoDB", type: "NoSQL", icon: Hexagon, status: "online" },
  { id: "redis", name: "Cache Layer", type: "KV", icon: Server, status: "warning" },
  { id: "api", name: "Internal Services", type: "API", icon: Activity, status: "online" },
];

export function Sidebar() {
  const { isSidebarOpen, setSidebarOpen, activeDatabase, setActiveDatabase } = useAppStore();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-card/80 backdrop-blur-xl border-r border-white/20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ease-in-out flex flex-col",
        !isSidebarOpen && "-translate-x-full"
      )}
    >
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-border/50">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Activity className="w-5 h-5" />
          </div>
          DataNexus
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-auto py-4 space-y-6">
        <div className="px-4">
          <h3 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Data Connectors
          </h3>
          <ul className="space-y-1">
            {connectors.map((connector) => (
              <li key={connector.id}>
                <button
                  onClick={() => setActiveDatabase(connector.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-2 py-2 text-sm font-medium transition-colors hover:bg-muted/50",
                    activeDatabase === connector.id ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground"
                  )}
                >
                  <connector.icon className="w-4 h-4 ml-1" />
                  <span className="flex-1 text-left">{connector.name}</span>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      connector.status === "online" ? "bg-green-500" : "bg-yellow-500"
                    )}
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="px-4">
          <h3 className="mb-2 px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Library
          </h3>
          <ul className="space-y-1 text-sm font-medium text-muted-foreground">
            <li>
              <button className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors">
                <Star className="w-4 h-4 ml-1" />
                Saved Queries
              </button>
            </li>
            <li>
              <button className="w-full flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-muted/50 transition-colors">
                <Clock className="w-4 h-4 ml-1" />
                Query History
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
          <div className="w-8 h-8 rounded-full bg-primary/20" />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium leading-none truncate">Jane Engineer</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">jane.engineer@company.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
