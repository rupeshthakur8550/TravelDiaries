import React from 'react'
import { Search } from '../PageRoutes'

function Posts() {
  return (
    <>
      <div className='pl-[10vw] pr-[10vw]'>
      <Search/>
      </div>
      <div className='min-h-screen'>All Posts</div>
    </>
  )
}

export default Posts