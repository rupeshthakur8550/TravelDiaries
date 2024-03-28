import React from 'react'
import { HiHome, HiOutlineSearch, HiOutlineFolderAdd, HiUserCircle } from 'react-icons/hi';
import { MdMessage } from "react-icons/md";
import { NavLink } from 'react-router-dom';

function StickyFooter() {
  return (
    <div className='fixed bottom-0 left-0 right-0 flex md:hidden flex-row justify-center items-center gap-9 pr-2 pl-2 z-50'>
      <NavLink to="/allposts">
        <HiHome className='w-10 h-10' />
      </NavLink>
      <NavLink to="/search">
        <HiOutlineSearch className='w-10 h-10' />
      </NavLink>
      <NavLink to="/addPosts">
        <HiOutlineFolderAdd className='w-10 h-10' />
      </NavLink>
      <NavLink to="/allposts">
        <MdMessage className='w-10 h-10' />
      </NavLink>
      <NavLink to="/myposts">
        <HiUserCircle className='w-10 h-10' />
      </NavLink>
    </div>
  )
}

export default StickyFooter