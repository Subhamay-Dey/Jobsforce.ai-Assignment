"use client";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../../constants/index";
import { Editor, Monaco } from "@monaco-editor/react";
import { motion } from "framer-motion";
import Image from "next/image";
import { PlayIcon, RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import useMounted from "@/hooks/useMounted";
import EditorPanelSkeleton from "../Skeleton/EditorPanelSkeleton";
import CompillePanel from "../OutputPanel/CompillePanel";
import { useCompileStore } from "@/store/useCompileStore";
// import ShareSnippetDialog from "./ShareSnippetDialog";

interface TestCase {
  input: string;
  output: string;
}

function EditorPanel({questionTitle}:{questionTitle: any}) {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore() as {
    language: string;
    theme: string;
    fontSize: number;
    editor: any;
    setFontSize: (size: number) => void;
    setEditor: (editor:any) => void;
  };

  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [boilerplateCode, setBoilerplateCode] = useState<string | null>(null);
  const [isEditorMounted, setIsEditorMounted] = useState(false);
  const [editorValue, setEditorValue] = useState<string | undefined>();
  const mounted = useMounted();

  const {setCompileLanguage, setNewCode, setCompileTestCases} = useCompileStore() as {
    setCompileLanguage: (compilelanguage: string) => void,
    setNewCode: (newCode: string | undefined) => void,
    setCompileTestCases: (compiletestCases: { input: string; output: string }[]) => void
  }

  useEffect(() => {
    if (!questionTitle) return;

    const fetchProblemDescription = async () => {
      try {
        const response = await fetch(`/api/leetcode?questionName=${encodeURIComponent(questionTitle)}`);
        const data = await response.json();

        if (data.description) {
          setDescription(data.description);
          setTestCases(data.testCases || []);
        } else {
          setDescription("Problem not found.");
        }
      } catch (error) {
        setDescription("Error fetching problem.");
      } finally {
        setLoading(false);
      }
    };

    fetchProblemDescription();
  }, [language, questionTitle])

  useEffect(() => {

    const fetchBoilerplate = async () => {
      try {
        const response = await fetch(`/api/generate-boilerplate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            language:language,
            title: questionTitle,
            description:description,
            testCases:testCases,
          }),
        });

        const data = await response.json();
        setBoilerplateCode(data.boilerplate);
        if (editor && data.boilerplate) {
          editor.setValue(data.boilerplate); 
          setIsEditorMounted(true);
        }
      } catch (error) {
        console.error("Error fetching boilerplate:", error);
      }
    }
    if (language && questionTitle && description && testCases.length > 0) {
      fetchBoilerplate();
    }

  }, [language, questionTitle, description, testCases, editor]);

  useEffect(() => {
    if (language) {
      setCompileLanguage(language);
    }
  }, [language, setCompileLanguage]);

  useEffect(() => {
    if (testCases.length > 0) {
      setCompileTestCases(testCases);
    }
  }, [testCases, setCompileTestCases]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = boilerplateCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
    setEditorValue(value);
    setNewCode(value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 10), 21);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

    const handleRunCode = () => {
    if (!language || !editorValue || testCases.length === 0) {
      alert("Please write some code and ensure test cases are available.");
      return;
    }
    setCompileLanguage(language);
    setNewCode(editorValue);
    setCompileTestCases(testCases);
  };

  if (!mounted) return null;

  return (
    <div className="relative h-full">
      <div className="relative bg-[#12121a]/90 h-[800px] backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image src={"/" + language + ".png"} alt="Logo" width={24} height={24} />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">Write and execute your code</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="10"
                  max="21"
                  value={fontSize}
                  onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white ">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Editor  */}
        <div className="relative h-[680px] group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">

        {!isEditorMounted && <EditorPanelSkeleton />}

            <Editor
              height="680px"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },
              }}
            />
        </div>
        {/* Run Code Button */}
          <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRunCode}
          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
        >
          <PlayIcon className="w-5 h-5" />
          Run Code
        </motion.button>
      </div>
      {/* {isShareDialogOpen && <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />} */}
    </div>
  );
}
export default EditorPanel;