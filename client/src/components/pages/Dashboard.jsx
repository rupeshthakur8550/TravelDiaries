import { useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import DashSidebar from '../Dashboard/DashSidebar';
import DashProfile from '../Dashboard/DashProfile';
import DashDashboard from '../Dashboard/DashDashboard';
import DashUsers from '../Dashboard/DashUsers'
import DashPosts from '../Dashboard/DashPosts'
import DashUpdateProfile from '../Dashboard/DashUpdateProfile';

function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  return (
    <div className='h-screen flex flex-col md:flex-row'>
      <div className='hidden md:w-56 h-full md:inline-block'>
        <DashSidebar />
      </div>
      {tab === 'profile' && <div className='md:p-10 mt-10 mx-auto w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
        <DashProfile />
      </div>}
      {tab === 'dashboard' && <div className='max-w-lg mx-auto p-3 w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
        <DashDashboard />
      </div>}
      {tab === 'allusers' && <div className='max-w-lg mx-auto p-3 w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
        <DashUsers />
      </div>}
      {tab === 'allposts' && <div className='max-w-lg mx-auto p-3 w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
        <DashPosts />
      </div>}
      {tab === 'updateProfile' && <div className='max-w-lg mx-auto p-3 w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
        <DashUpdateProfile />
      </div>}
    </div>
  )
}

export default Dashboard