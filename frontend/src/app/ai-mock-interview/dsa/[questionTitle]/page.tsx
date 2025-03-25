import DsaQuestion from '@/components/DsaQuestion/DsaQuestion'
import Header from '@/components/Header/Header'
import React from 'react'

function page() {
  return (
    <div className='h-screen'>
      <div className='w-full max-auto py-4 px-5'>
        <Header/>
      </div>
      <DsaQuestion/>
    </div>
  )
}

export default page