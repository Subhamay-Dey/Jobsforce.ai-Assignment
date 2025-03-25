import React from 'react'
import EditorPanel from '../EditorPanel/EditorPanel'
import OutputPanel from '../OutputPanel/OutputPanel'

function EditorHome() {
  return (
    <div className='h-full'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <EditorPanel/>
        <OutputPanel/>
      </div>
    </div>
  )
}

export default EditorHome