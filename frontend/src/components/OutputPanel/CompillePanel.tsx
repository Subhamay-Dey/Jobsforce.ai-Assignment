import { useCompileStore } from '@/store/useCompileStore';
import { Clock } from 'lucide-react'
import React from 'react'

function CompillePanel() {

  const { compilelanguage, newCode, compiletestCases } = useCompileStore();
  console.log("Compile Language:", compilelanguage);
  console.log("New Code:", newCode);
  console.log("Compile Test Cases:", compiletestCases);

  return (
    <div className="relative">
    <div className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
    rounded-xl p-4 h-[420px] overflow-auto font-mono text-sm">
      <div className="h-full flex flex-col items-center justify-between text-gray-500">
        <div className="flex flex-col justify-center items-center h-[200px]">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
            <Clock className="w-6 h-6" />
          </div>
          <p className="text-center">Run your code to see the output here...</p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default CompillePanel