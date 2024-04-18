import { Typography } from '@mui/material';
import { Button } from 'flowbite-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

function MyPosts() {
  const { currentUser, error } = useSelector(state => state.user);
  return (
    <>
      <div className='md:w-[50%] lg:w-[25%] mx-auto pt-2 md:pt-14 mt-20'>
        <div className='flex px-4 md:justify-center py-3 gap-6 md:gap-8 mb-1'>
          <img className="w-16 h-16 rounded-full" src={currentUser.profilePicture} alt="User Profile" />
          <div>
            <Typography variant='h5'>{currentUser.name}</Typography>
            <Typography>@{currentUser.username}</Typography>
          </div>
          <div>
            <Typography variant='h5'>Posts</Typography>
            <Typography className='text-center' style={{ fontSize: '20px' }}>0</Typography>
          </div>
        </div>
        <Typography className='text-center pb-4 text-base md:text-lg px-3'>{currentUser.bio}</Typography>
        <NavLink to='/dashboard?tab=profile'>
          <Button gradientDuoTone="pinkToOrange" outline type='submit' className='w-[90%] md:w-96 md:self-center mx-auto'>
            Edit Profile
          </Button>
        </NavLink>

      </div>
    </>
  )
}

export default MyPosts