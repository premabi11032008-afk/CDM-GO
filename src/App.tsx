import { Menu } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Sidebar } from "@/components/Sidebar";
import { GlobalSearch } from "@/components/GlobalSearch";
import { QueryEditor } from "@/components/QueryEditor";
import { ResultViewer } from "@/components/ResultViewer";

export default function App() {
  const { isSidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <div className="flex bg-background h-screen w-full overflow-hidden text-foreground">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col h-full transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        {/* Top Navigation */}
        <header className="h-20 shrink-0 flex items-center px-4 md:px-6 z-10 gap-4">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1 mt-2">
            <GlobalSearch />
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 p-4 md:p-6 pt-0 overflow-hidden">
          {/* Query Editor Panel */}
          <section className="flex-1 min-h-[300px] lg:min-h-0 flex flex-col">
            <QueryEditor />
          </section>

          {/* Results Panel */}
          <section className="flex-1 min-h-[400px] lg:min-h-0 flex flex-col">
            <ResultViewer />
          </section>
        </div>
      </main>
    </div>
  );
}
