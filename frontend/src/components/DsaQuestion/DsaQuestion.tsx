"use client";

import React from 'react'
import Split from "react-split"
import ProblemDescription from './ProblemDescription/ProblemDescription'
import styles from './DsaQuestion.module.scss'
import { useParams } from 'next/navigation';

function DsaQuestion() {

  const {questionTitle} = useParams();
  return (
    <Split 
    className={styles.split}
    >
        <ProblemDescription questionTitle={questionTitle}/>
        <div>The Code Editor will be here</div>
    </Split>
  )
}

export default DsaQuestion






















//   sizes={[50, 50]} 
//   minSize={200}
//   expandToMin={false} 
//   gutterSize={10} 
//   gutterAlign="center" 
//   snapOffset={30} 
//   dragInterval={1} 
//   direction="horizontal"
//   cursor="col-resize"