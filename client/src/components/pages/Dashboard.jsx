import { useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import DashSidebar from '../Dashboard/DashSidebar';
import DashProfile from '../Dashboard/DashProfile';
import DashDashboard from '../Dashboard/DashDashboard';
import DashUsers from '../Dashboard/DashUsers'
import DashPosts from '../Dashboard/DashPosts'
import Sidebars from '../Dashboard/Sidebar'

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
    <div className='flex flex-row max-h-screen'>
      <div className='min-w-36 mx-5 h-[86vh]'>
        <Sidebars />
      </div>
      <div >
      </div>
    </div>
    // <div className='h-screen flex flex-col md:flex-row'>
    //   <div className='hidden md:w-56 h-full md:inline-block'>
    //     <DashSidebar />
    //   </div>
    //   {tab === 'profile' && <div className='max-w-lg mx-auto p-3 w-full'>
    //     <DashProfile />
    //   </div>}
    //   {tab === 'dashboard' && <div className='max-w-lg mx-auto p-3 w-full'>
    //     <DashDashboard />
    //   </div>}
    //   {tab === 'allusers' && <div className='max-w-lg mx-auto p-3 w-full'>
    //     <DashUsers />
    //   </div>}
    //   {tab === 'allposts' && <div className='max-w-lg mx-auto p-3 w-full'>
    //     <DashPosts />
    //   </div>}
    // </div>
  )
}

export default Dashboard