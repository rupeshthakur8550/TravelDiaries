import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

function Posts() {
  const location = useLocation();
  const isBriefInfo = location.pathname.includes('briefinfo');
  return (
    <>
      <div className='min-h-screen mt-20'>
        {!isBriefInfo && <h1> All Posts</h1>}
        <Outlet />
      </div>
    </>
  )
}

export default Posts