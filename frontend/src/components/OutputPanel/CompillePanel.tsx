import { useCompileStore } from '@/store/useCompileStore';
import axios from 'axios';
import { CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getLanguageId } from './LanguagetoId';

interface ResultsType {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  expanded: boolean;
}

function CompilePanel() {
  const { compilelanguage, newCode, compiletestCases } = useCompileStore();
  const [testResults, setTestResults] = useState<ResultsType[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [overallStatus, setOverallStatus] = useState<{ passed: number; total: number } | null>(null);

  // Function to normalize output (trim and standardize line endings)
  // const normalizeOutput = (output: string): string => {
  //   return output
  //     .trim()
  //     .replace(/\r\n/g, '\n')
  //     .replace(/\n+/g, '\n')
  //     .replace(/\s+$/gm, ''); // Remove trailing spaces on each line
  // };

  const toggleExpand = (index: number) => {
    setTestResults(prevResults => 
      prevResults.map((result, i) => 
        i === index ? { ...result, expanded: !result.expanded } : result
      )
    );
  };

  const runCode = async () => {
    if (!compilelanguage || !newCode || compiletestCases.length === 0) {
      console.warn('Missing data, not sending request');
      return;
    }

    setIsRunning(true);
    setTestResults([]);
    setOverallStatus(null);
    
    const language_id = getLanguageId(compilelanguage);
    if (!language_id) {
      console.error('Invalid language:', compilelanguage);
      setIsRunning(false);
      return;
    }

    try {
      // Remove comments from the code before execution
      const cleanResponse = await axios.post('/api/remove-comments', {
        code: newCode,
        language: compilelanguage,
      });

      if (cleanResponse.data.error) {
        console.error("Error in comment removal:", cleanResponse.data.error);
        setIsRunning(false);
        return;
      }

      const cleanedCode = cleanResponse.data.cleanedCode;
      const results: ResultsType[] = [];
      let passedCount = 0;
      console.log(compiletestCases);
      

      for (let i = 0; i < compiletestCases.length; i++) {
        const testCase = compiletestCases[i];
        const actualInput = testCase.input;
        
        try {
          const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: compilelanguage.toLowerCase(),
            version: "*",
            files: [{ content: cleanedCode }],
            stdin: compiletestCases[i].input,
            // run_timeout: 5000, // Increased timeout for complex problems
          });

          const { stdout, stderr, code } = response.data.run;
          
          // Handle execution errors
          if (code !== 0 || stderr) {
            results.push({
              index: i,
              input: actualInput,
              expectedOutput: compiletestCases[i].expectedOutput,
              actualOutput: stderr || "Runtime error occurred",
              passed: false,
              expanded: true // Auto-expand failed tests
            });
            continue;
          }

          // const normalizedActual = normalizeOutput(stdout);
          // const normalizedExpected = normalizeOutput(testCase.expectedOutput);
          // const passed = normalizedActual === normalizedExpected;

          const passed = actualInput === compiletestCases[i].expectedOutput
          
          if (passed) passedCount++;

          results.push({
            index: i,
            input: actualInput,
            expectedOutput: compiletestCases[i].expectedOutput,
            actualOutput: stdout,
            passed,
            expanded: !passed // Auto-expand failed tests
          });
        } catch (error) {
          console.error(`Error in test case ${i}:`, error);
          results.push({
            index: i,
            input: actualInput,
            expectedOutput: testCase.expectedOutput,
            actualOutput: "Error executing code",
            passed: false,
            expanded: true // Auto-expand failed tests
          });
        }
      }

      setTestResults(results);
      setOverallStatus({ passed: passedCount, total: compiletestCases.length });
    } catch (error) {
      console.error('Error while processing:', error);
    }

    setIsRunning(false);
  };

  useEffect(() => {
    // Avoid running on initial render
    if (compilelanguage && newCode && compiletestCases.length > 0) {
      runCode();
    }
  }, []); // Empty dependency array to avoid auto-running

  return (
    <div className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] rounded-xl p-4 h-[420px] overflow-auto font-mono text-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-white font-medium">Test Results</h3>
        <button 
          onClick={runCode}
          disabled={isRunning}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50"
        >
          {isRunning ? 'Running...' : 'Run Tests'}
        </button>
      </div>

      {isRunning ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-400">Running test cases...</p>
        </div>
      ) : testResults.length > 0 ? (
        <div className="flex flex-col space-y-3">
          {overallStatus && (
            <div className={`p-3 rounded-lg ${
              overallStatus.passed === overallStatus.total 
                ? 'bg-green-900/30 border border-green-700' 
                : 'bg-red-900/30 border border-red-700'
            }`}>
              <span className="text-white">
                {overallStatus.passed === overallStatus.total 
                  ? '✅ All tests passed!' 
                  : `⚠️ ${overallStatus.passed}/${overallStatus.total} tests passed`}
              </span>
            </div>
          )}
          
          {testResults.map((result, index) => (
            <div key={index} className="border border-gray-700 rounded-lg overflow-hidden">
              <div 
                className={`flex items-center justify-between p-3 cursor-pointer ${
                  result.passed ? 'bg-gray-800' : 'bg-red-900/30'
                }`}
                onClick={() => toggleExpand(index)}
              >
                <div className="flex items-center">
                  {result.passed ? (
                    <CheckCircle className="text-green-500 mr-2" size={18} />
                  ) : (
                    <XCircle className="text-red-500 mr-2" size={18} />
                  )}
                  <span className="text-white">Test Case {index + 1}</span>
                </div>
                
                {result.expanded ? 
                  <ChevronUp size={18} className="text-gray-400" /> : 
                  <ChevronDown size={18} className="text-gray-400" />
                }
              </div>
              
              {result.expanded && (
                <div className="p-3 bg-gray-900 text-xs">
                  <div className="mb-2">
                    <div className="text-gray-400 mb-1">Input:</div>
                    <pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap overflow-x-auto">
                      {result.input || "(empty)"}
                    </pre>
                  </div>
                  
                  <div className="mb-2">
                    <div className="text-gray-400 mb-1">Expected Output:</div>
                    <pre className="bg-gray-800 p-2 rounded whitespace-pre-wrap overflow-x-auto">
                      {result.expectedOutput || "(empty)"}
                    </pre>
                  </div>
                  
                  <div>
                    <div className={`mb-1 ${!result.passed ? "text-red-400" : "text-gray-400"}`}>
                      Actual Output:
                    </div>
                    <pre className={`p-2 rounded whitespace-pre-wrap overflow-x-auto ${
                      result.passed ? "bg-gray-800" : "bg-red-900/20 border border-red-700"
                    }`}>
                      {result.actualOutput || "(empty)"}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-center text-gray-500">
          <p>Run your code to see the output here...</p>
          <p className="text-xs mt-2">Click the "Run Tests" button to execute your code against all test cases.</p>
        </div>
      )}
    </div>
  );
}

export default CompilePanel;







        // const response = await axios.post('/api/judge0-submit-code', {
        //   code: cleanedCode,
        //   language_id,
        //   test_cases: compiletestCases
        // });

        // console.log('Judge0 API Response:', response.data);