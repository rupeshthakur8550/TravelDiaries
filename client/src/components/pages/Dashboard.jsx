import { useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import DashSidebar from '../Dashboard/DashSidebar';
import DashProfile from '../Dashboard/DashProfile';

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
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='hidden md:w-56 md:inline-block'>
        <DashSidebar />
      </div>
      {tab === 'profile' && <div className='max-w-lg mx-auto p-3 w-full'>
        <DashProfile />
      </div>}
    </div>
  )
}

export default Dashboard