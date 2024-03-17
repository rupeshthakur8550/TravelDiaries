import React from 'react'
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { FaMoon } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import DashSidebar from '../Dashboard/DashSidebar'

function Header() {
  const { currentUser } = useSelector(state => state.user);
  const path = useLocation().pathname;
  return (
    <Navbar className='border-b-2'>
      <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-extrabold bg-gradient-to-r from-white from-30% via-orange-300 to-rose-500 rounded-lg text-white' style={{ fontVariant: 'unicase' }}>
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-lg inline-block text-transparent bg-clip-text'>Travel</span>
        Diaries
      </Link>

      {currentUser ? (
        <>
          <div className='flex justify-center items-center lg:pl-[30vh] md:pr-[8vh]'>
            <div className='hidden md:flex justify-center items-center lg:gap-5 md:gap-0'>
              <NavLink
                to="/allposts"
                className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold`}
              >
                All Posts
              </NavLink>
              <NavLink
                to="/myposts"
                className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold`}
              >
                My Posts
              </NavLink>
              <NavLink
                to="/addPosts"
                className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold`}
              >
                Add Posts
              </NavLink>
            </div>
          </div>
          <div className='flex gap-2'>
            <Dropdown arrowIcon={false} inline label={<Navbar.Toggle />}>
              <Navbar.Collapse>
                <NavLink
                  to="/allposts"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-teal-600 lg:p-0`}
                >
                  All Posts
                </NavLink>
                <NavLink
                  to="/myposts"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-teal-600 lg:p-0`}
                >
                  My Posts
                </NavLink>
                <NavLink
                  to="/addPosts"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 hover:text-teal-600 lg:p-0`}
                >
                  Add Posts
                </NavLink>
              </Navbar.Collapse>
            </Dropdown>
            <h1 className={`text-sm font-medium truncate lg:block py-2 pr-4 pl-3 hidden md:hidden`} style={{fontVariant: "petite-caps"}}>
              Welcome, {<span className='text-green-600'>{currentUser.name}</span>}
            </h1>
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar
                  alt='user'
                  img={currentUser.profilePicture}
                  rounded />
              }>
              <Dropdown.Header>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>{currentUser.name}</span>
              </Dropdown.Header>
              <DashSidebar />

            </Dropdown>
          </div>
        </>
      ) : (
        <div className='flex gap-3'>
          <NavLink
            to="/"
            className={({ isActive }) => `block py-2 duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold`}
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `block py-2 pr-[1vw] pl-[1vw] duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold`}
          >
            About
          </NavLink>
          <Link to="/signin">
            <Button gradientDuoTone="pinkToOrange" outline>
              Sign In
            </Button>
          </Link>
        </div>
      )}

    </Navbar >
  )
}

export default Header