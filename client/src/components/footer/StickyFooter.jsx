import React from 'react'
import { HiHome, HiOutlineSearch, HiOutlineFolderAdd} from 'react-icons/hi';
import { MdMessage } from "react-icons/md";
import { NavLink } from 'react-router-dom';

function StickyFooter() {
  return (
    <div class='fixed bottom-0 left-0 right-0 h-12 bg-white z-50 flex md:hidden flex-row justify-center items-center gap-10 pr-2 pl-2' style={{boxShadow: '0px -5px 10px rgba(0, 0, 0, 0.15)'}}>
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
    </div>
  )
}

export default StickyFooter