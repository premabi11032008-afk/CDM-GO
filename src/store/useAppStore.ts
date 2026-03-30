import { create } from "zustand";

interface State {
  isSidebarOpen: boolean;
  activeDatabase: string | null;
  activeQueryTab: string;
  searchQuery: string;
  setSidebarOpen: (isOpen: boolean) => void;
  setActiveDatabase: (db: string | null) => void;
  setActiveQueryTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  queryResult: any[] | null;
  setQueryResult: (result: any[] | null) => void;
}

export const useAppStore = create<State>((set) => ({
  isSidebarOpen: true,
  activeDatabase: null,
  activeQueryTab: "query-1",
  searchQuery: "",
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setActiveDatabase: (db) => set({ activeDatabase: db }),
  setActiveQueryTab: (tab) => set({ activeQueryTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  queryResult: null,
  setQueryResult: (result) => set({ queryResult: result }),
}));
