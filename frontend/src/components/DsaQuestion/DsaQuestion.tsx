"use client";

import React from 'react'
import Split from "react-split"
import ProblemDescription from '../ProblemDescription/ProblemDescription'
import styles from './DsaQuestion.module.scss'
import { useParams } from 'next/navigation';
import EditorHome from '../EditorHome/EditorHome';

function DsaQuestion() {

  const {questionTitle} = useParams();
  return (
      <Split 
      sizes={[35, 65]}
      className={styles.split}
      >
          <ProblemDescription questionTitle={questionTitle}/>
          <EditorHome/>
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