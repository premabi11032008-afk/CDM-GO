import { Menu } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Sidebar } from "@/components/Sidebar";
import { GlobalSearch } from "@/components/GlobalSearch";
import { QueryEditor } from "@/components/QueryEditor";
import { ResultViewer } from "@/components/ResultViewer";
import { GlobalChatbot } from "@/components/GlobalChatbot";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

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
        <div className="flex-1 flex flex-col w-full h-full p-4 md:p-6 pt-0 overflow-hidden relative">
          <PanelGroup direction="horizontal" className="w-full h-full gap-2 rounded-2xl">
            
            {/* Query Editor Panel */}
            <Panel defaultSize={40} minSize={20} className="flex flex-col min-h-[300px]">
              <QueryEditor />
            </Panel>

            {/* Draggable Divider */}
            <PanelResizeHandle className="cursor-col-resize w-2 -mx-1 bg-border/40 hover:bg-primary/50 transition-all rounded-full flex flex-col items-center justify-center z-50">
              <div className="h-8 w-1 bg-muted-foreground/30 rounded-full" />
            </PanelResizeHandle>

            {/* Results Panel */}
            <Panel defaultSize={60} minSize={30} className="flex flex-col min-h-[400px]">
              <ResultViewer />
            </Panel>
            
          </PanelGroup>
        </div>

        {/* Global Floating AI Chat */}
        <GlobalChatbot />
      </main>
    </div>
  );
}
