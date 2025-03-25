import { create } from "zustand";

interface BoilerplateState {
  boilerplate: Record<string, string>;
  fetchBoilerplate: (language: string, title: string, description: string, testCases: any) => Promise<void>;
}

const useBoilerplateStore = create<BoilerplateState>((set) => ({
  boilerplate: {},
  fetchBoilerplate: async (language, title, description, testCases) => {
    const res = await fetch("/api/generate-boilerplate", {
      method: "POST",
      body: JSON.stringify({ language, title, description, testCases }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (data.boilerplate) {
      set((state) => ({
        boilerplate: { ...state.boilerplate, [language]: data.boilerplate },
      }));
    }
  },
}));

export default useBoilerplateStore;