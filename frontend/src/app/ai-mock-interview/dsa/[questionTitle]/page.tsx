import DsaQuestion from '@/components/DsaQuestion/DsaQuestion'
import Header from '@/components/Header/Header'
import React from 'react'

function page() {
  return (
    <div className='h-screen'>
      <div className='max-w-[1800px] max-auto p-4'>
        <Header/>
      </div>
      <DsaQuestion/>
    </div>
  )
}

export default page