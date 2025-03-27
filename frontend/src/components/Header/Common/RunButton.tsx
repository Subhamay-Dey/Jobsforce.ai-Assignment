"use client";

import React from 'react'
import { motion } from "framer-motion";
import { PlayIcon } from 'lucide-react';
// import { useRunCodeStore } from '@/store/useRunCodeStore';

interface RunCodeButtonProps {
  onRun: () => void;
}

function RunButton({ onRun }: RunCodeButtonProps) {

  // const {handleRunCode} = useRunCodeStore();

  return (
    <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          // onClick={handleRunCode}
          onClick={onRun}
          className="mt-4 w-30 bg-blue-600 text-white p-2 rounded-lg flex items-center justify-center gap-2"
        >
          <PlayIcon className="w-5 h-5" />
          Run Code
        </motion.button>
  )
}

export default RunButton