"use client";

import { useEffect, useState } from "react";
import { Terminal, Clock } from "lucide-react";
import htmlToMd from "html-to-md";
import Split from "react-split"
import CompillePanel from "./CompillePanel";
import TestCases from "./TestCases";
import styles from "./styles.module.scss"
import OutputPannelHeader from "./OutputPannelHeader";

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

      <OutputPannelHeader/>

      <Split className='h-[calc(100vh-200px)]' direction='vertical' sizes={[60, 40]} minSize={60} gutterSize={10}>
				<div className='w-full overflow-auto'>
          <CompillePanel/>
				</div>
				<div className='w-full overflow-auto'>

					<TestCases testCases={testCases}/>
				</div>
			</Split>

    </div>
  );
}

export default OutputPanel;
