import React, { useState } from 'react';

interface TestCase {
  input: string;
  output: string;
}

const TestCases = ({ testCases }:{testCases: TestCase[]}) => {
  const [activeTestCaseId, setActiveTestCaseId] = useState(0);

  return (
    <div className="relative">
    <div className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] rounded-xl px-4">

    	{/* testcase heading */}
      <div className='flex h-10 items-center space-x-6'>
        <div className='relative flex h-full flex-col justify-center cursor-pointer'>
          <div className='text-sm font-medium leading-5 text-white'>Testcases</div>
          <hr className='absolute bottom-1 h-0.5 w-full rounded-full border-none bg-white' />
        </div>
      </div>
      
      {/* Test Case Selector */}
      <div className='flex'>
        {testCases.map((_, index) => (
          <div
            className='mr-2 items-start mt-2'
            key={index}
            onClick={() => setActiveTestCaseId(index)}
          >
            <div
              className={`font-medium items-center transition-all focus:outline-none inline-flex bg-dark-fill-3 hover:bg-dark-fill-2 relative rounded-lg px-4 py-1 cursor-pointer whitespace-nowrap
              ${activeTestCaseId === index ? "text-white bg-[#1e1e2e]/100" : "text-gray-500 "}`}
            >
              Case {index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Active Test Case Details */}
      {testCases.length > 0 && (
        <div className='font-semibold my-4'>
          <p className='text-sm font-medium mt-4 text-white'>Input:</p>
          <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-[#1e1e2e]/50 border-transparent text-white mt-2'>
            {testCases[activeTestCaseId].input}
          </div>
          <p className='text-sm font-medium mt-4 text-white'>Output:</p>
          <div className='w-full cursor-text rounded-lg border px-3 py-[10px] bg-[#1e1e2e]/50 border-transparent text-white mt-2'>
            {testCases[activeTestCaseId].output}
          </div>
        </div>
      )}
    </div>
    </div>
  );
};

export default TestCases;
