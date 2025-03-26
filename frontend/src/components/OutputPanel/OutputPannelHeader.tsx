import { Terminal } from 'lucide-react'
import React from 'react'

function OutputPannelHeader() {
  return (
    <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-[#1e1e2e] ring-1 ring-gray-800/50">
        <Terminal className="w-4 h-4 text-blue-400" />
      </div>
      <span className="text-sm font-medium text-gray-300">Output</span>
    </div>
  </div>
  )
}

export default OutputPannelHeader