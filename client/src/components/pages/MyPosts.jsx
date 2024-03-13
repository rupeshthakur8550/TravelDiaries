import React from 'react'
import { Search } from '../PageRoutes'

function MyPosts() {
  return (
    <>
      <div className='pl-[10vw] pr-[10vw]'>
      <Search/>
      </div>
      <div className='min-h-screen'>MyPosts</div>
    </>
  )
}

export default MyPosts