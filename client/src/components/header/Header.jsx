import React from 'react'
import { Avatar, Button, Dropdown, Navbar } from 'flowbite-react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {signoutSuccess} from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';

function Header() {
  const { currentUser } = useSelector(state => state.user);
  const path = useLocation().pathname;
  const dispatch = useDispatch();

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    const offsetTop = aboutSection.offsetTop;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  };

  return (
    <div className='fixed top-0 left-0 right-0 bg-white shadow-lg z-50 m-2'>
      <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-extrabold bg-gradient-to-r from-white from-30% via-orange-300 to-rose-500 rounded-lg text-white' style={{ fontVariant: 'unicase' }}>
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-lg inline-block text-transparent bg-clip-text'>Travel</span>
          Diaries
        </Link>

        {currentUser ? (
          <>
            <div className='flex justify-center items-center lg:pl-[30vh] md:pr-[11vh]'>
              <div className='hidden md:flex justify-center items-center lg:gap-5 md:gap-0'>
                <NavLink
                  to="/allposts"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold`}
                >
                  Feed
                </NavLink>
                <NavLink
                  to="/search"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold`}
                >
                  Find
                </NavLink>
                <NavLink
                  to="/addPosts"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold`}
                >
                  Upload
                </NavLink>
                <NavLink
                  to="/#"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold`}
                >
                  Chats
                </NavLink>

              </div>
            </div>
            <div className='flex gap-2'>
              <h1 className={`text-sm font-medium truncate lg:block py-2 pr-4 pl-3 hidden md:hidden`} style={{ fontVariant: "petite-caps" }}>
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
                <Link to={'/myposts'}>
                  <Dropdown.Item className='text-md'>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item className='text-md' onClick={handleSignout}>Sign Out</Dropdown.Item>
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
              to="#"
              className={({ isActive }) => `block py-2 pr-[1vw] pl-[1vw] duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold`}
              onClick={scrollToAbout}
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
    </div>
  )
}

export default Header