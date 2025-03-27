import { create } from "zustand";

interface CompileState {
  compilelanguage: string;
  newCode: string;
  compiletestCases: { input: string; output: string }[];
  setCompileLanguage: (compilelanguage: string) => void;
  setNewCode: (code: string) => void;
  setCompileTestCases: (testCases: { input: string; output: string }[]) => void;
}

export const useCompileStore = create<CompileState>((set) => ({
  compilelanguage: "javascript", // Default value
  newCode: "",
  compiletestCases: [],
  setCompileLanguage: (compilelanguage) => set({ compilelanguage }),
  setNewCode: (code) => set({ newCode: code }),
  setCompileTestCases: (compiletestCases) => set({ compiletestCases }),
}));