import { useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import DashSidebar from '../Dashboard/DashSidebar';
import DashProfile from '../Dashboard/DashProfile';
import DashDashboard from '../Dashboard/DashDashboard';
import DashUsers from '../Dashboard/DashUsers';
import DashPosts from '../Dashboard/DashPosts';
import DashUpdateProfile from '../Dashboard/DashUpdateProfile';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const location = useLocation();
  const { selectedDashboard } = useSelector(state => state.app);
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
    console.log(selectedDashboard);
  }, [location.search]);

  return (
    <div className='h-screen flex flex-col sm:flex-row'>
      <div className={`md:w-56 h-full mt-20 sm:mt-0 ${selectedDashboard != '' ? 'hidden sm:inline-block' : 'inline-block'}`}>
        <DashSidebar />
      </div>
      {tab === 'profile' && (
        <div className='md:p-10 sm:pr-5 mt-10 mx-auto w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
          <DashProfile />
        </div>
      )}
      {tab === 'dashboard' && (
        <div className='max-w-lg mx-auto p-3 w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
          <DashDashboard />
        </div>
      )}
      {tab === 'allusers' && (
        <div className='md:p-10 mt-20 md:mt-10 mx-auto w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
          <DashUsers />
        </div>
      )}
      {tab === 'allposts' && (
        <div className='md:p-10 mt-7 mx-auto w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
          <DashPosts />
        </div>
      )}
      {tab === 'updateProfile' && (
        <div className='max-w-lg mx-auto p-3 w-full overflow-y-auto' style={{ scrollbarWidth: 'none' }}>
          <DashUpdateProfile />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
