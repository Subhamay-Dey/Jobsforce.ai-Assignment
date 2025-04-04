import React from 'react'
import EditorPanel from '../EditorPanel/EditorPanel'
import OutputPanel from '../OutputPanel/OutputPanel'

function EditorHome({title}:{title: any}) {
  return (
    <div className='h-full'>
      <div className='grid grid-cols-1 lg:grid-cols-[55%_45%] h-full gap-4 px-4'>
        <EditorPanel questionTitle={title}/>
        <OutputPanel questionTitle={title}/>
      </div>
    </div>
  )
}

export default EditorHome