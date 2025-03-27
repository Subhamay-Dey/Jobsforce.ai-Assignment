const languageMap: Record<string, number> = {
    javascript: 63,
    typescript: 74,
    python: 71,
    java: 62,
    go: 60,
    rust: 73,
    cpp: 54,
    csharp: 51,
    ruby: 72,
    swift: 83,
  };
  
  export const getLanguageId = (language: string): number | null => {
    return languageMap[language.toLowerCase()] || null;
  };