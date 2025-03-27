import { create } from "zustand";

interface RunCodeStore {
  handleRunCode: () => void;
  setHandleRunCode: (fn: () => void) => void;
}

export const useRunCodeStore = create<RunCodeStore>((set) => ({
  handleRunCode: () => {},
  setHandleRunCode: (fn) => set({ handleRunCode: fn }),
}));