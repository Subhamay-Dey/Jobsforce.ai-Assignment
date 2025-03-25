"use client";

import { useEffect, useState } from "react";
import { Terminal, Clock } from "lucide-react";
import htmlToMd from "html-to-md";

interface TestCase {
  input: string;
  output: string;
}

function OutputPanel({ questionTitle }: { questionTitle: string }) {
  const [description, setDescription] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Medium");
  const [testCases, setTestCases] = useState<TestCase[]>([]);

  useEffect(() => {
    if (!questionTitle) return;

    const fetchProblemDescription = async () => {
      try {
        const response = await fetch(`/api/leetcode?questionName=${encodeURIComponent(questionTitle)}`);
        const data = await response.json();

        if (data.description) {
          const markdown = htmlToMd(data.description);
          setDescription(markdown);
          setDifficulty(data.difficulty);
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
  }, [questionTitle]);

  return (
    <div className="relative bg-[#181825] rounded-xl p-4 mr-4 ring-1 ring-gray-800/50">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
            <Terminal className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>
      </div>

      {/* Output Area */}
      <div className="relative">
        <div className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-4 h-[600px] overflow-auto font-mono text-sm">
          <div className="h-full flex flex-col items-center justify-between text-gray-500">
            <div className="p-6">
              <h3 className="text-xl font-bold text-white pb-4">Test Cases</h3>
              {testCases.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-300">
                  {testCases.map((tc, idx) => (
                    <li key={idx}>
                      <p><strong>Input:</strong> {tc.input}</p>
                      <p><strong>Output:</strong> {tc.output}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No test cases found.</p>
              )}
            </div>
            <div className="flex flex-col justify-center items-center h-[200px]">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center">Run your code to see the output here...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
