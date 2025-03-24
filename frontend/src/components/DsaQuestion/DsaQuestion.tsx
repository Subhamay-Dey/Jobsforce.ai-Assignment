import React from 'react'
import Split from "react-split"
import ProblemDescription from './ProblemDescription/ProblemDescription'

function DsaQuestion() {
  return (
    <Split className='split'>
        <ProblemDescription/>
    </Split>
  )
}

export default DsaQuestion