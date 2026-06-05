import { create } from "zustand";

interface State {
  isSidebarOpen: boolean;
  activeDatabase: string | null;
  activeQueryTab: string;
  searchQuery: string;
  customDbUrl: string;
  setSidebarOpen: (isOpen: boolean) => void;
  setActiveDatabase: (db: string | null) => void;
  setActiveQueryTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setCustomDbUrl: (url: string) => void;
  queryResult: any[] | null;
  setQueryResult: (result: any[] | null) => void;
}

export const useAppStore = create<State>((set) => ({
  isSidebarOpen: true,
  activeDatabase: null,
  activeQueryTab: "query-1",
  searchQuery: "",
  customDbUrl: "",
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
  setActiveDatabase: (db) => set({ activeDatabase: db }),
  setActiveQueryTab: (tab) => set({ activeQueryTab: tab }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setCustomDbUrl: (url) => set({ customDbUrl: url }),
  queryResult: null,
  setQueryResult: (result) => set({ queryResult: result }),
}));
