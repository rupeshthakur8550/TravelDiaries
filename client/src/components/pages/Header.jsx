import React, { useState } from 'react'
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { HiSearch } from "react-icons/hi";
import { signoutSuccess } from '../../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const Header = () => {
  const { currentUser } = useSelector(state => state.user);
  const [headerValue, setHeaderValue] = useState(currentUser ? '' : 'Home');
  const [linkValue, setLinkValue] = useState(currentUser ? '/allposts' : '/');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleDropdownItemClick = (value, link) => {
    setHeaderValue(value);
    setLinkValue(link);
    if (value === 'Search') {
      setShowSearchInput(true);
    } else {
      setShowSearchInput(false);
    }
    navigate(link);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='fixed top-0 left-0 right-0 shadow-lg z-50 m-2'>
      <Navbar className='border-b-2'>
        <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-extrabold bg-gradient-to-r from-white from-30% via-orange-300 to-rose-500 rounded-lg text-white' style={{ fontVariant: 'unicase' }}>
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% rounded-lg inline-block text-transparent bg-clip-text'>Travel</span>
          Diaries
        </Link>

        {currentUser ? (
          <>
            <div className='flex justify-center items-center lg:pl-[30vh] md:pr-[11vh]'>
              <div className='hidden sm:flex justify-center items-center lg:gap-5 md:gap-0'>
                <NavLink
                  to="/allposts"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold hidden sm:block`}
                >
                  Feed
                </NavLink>
                {showSearchInput && (
                  <TextInput
                    type="text"
                    placeholder="Search Items.."
                    icon={HiSearch}
                    // onChange={(e) => setSearch(e.target.value)}
                    className="border-b my-1 block sm:hidden"
                    style={{ height: "5vh", outline: "none" }}
                  />
                )}
                <TextInput
                  type="text"
                  placeholder="Search Items.."
                  icon={HiSearch}
                  // onChange={(e) => setSearch(e.target.value)}
                  className="border-b hidden sm:block w-[25vw]"
                  style={{ height: "5.5vh", outline: "none" }}
                />
                <NavLink
                  to="/addPosts"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold hidden sm:block`}
                >
                  Add Posts
                </NavLink>
                <NavLink
                  to="/messages"
                  className={({ isActive }) => `block py-2 pr-4 pl-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold hidden sm:block`}
                >
                  Chats
                </NavLink>
                <NavLink
                  to={linkValue}
                  className={({ isActive }) => `block py-2 duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold mr-2 md:mr-3 block sm:hidden`}
                >
                  {headerValue === 'Search Item' ? "" : headerValue}
                </NavLink>
                <div className='block sm:hidden mr-4'>
                  <Dropdown inline>
                    <Dropdown.Item className='text-md' onClick={() => handleDropdownItemClick('Feed', '/allposts')}>
                      Feed
                    </Dropdown.Item>
                    <Dropdown.Item className='text-md' onClick={() => handleDropdownItemClick('Search', "/allposts")}>
                      Search
                    </Dropdown.Item>
                    <Dropdown.Item className='text-md' onClick={() => handleDropdownItemClick('Add Posts', "/addPosts")}>
                      Add Posts
                    </Dropdown.Item>
                    <Dropdown.Item className='text-md' onClick={() => handleDropdownItemClick('Chat', '/messages')}>
                      Chat
                    </Dropdown.Item>
                  </Dropdown>
                </div>
              </div>
            </div>
            <div className='flex gap-2'>
              <h1 className={`text-sm font-medium truncate py-2 pr-4 pl-3 hidden md:block`} style={{ fontVariant: "petite-caps" }}>
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
                  <span className='block text-sm w-36 text-center'>@{currentUser.username}</span>
                  <span className='block text-sm font-medium truncate text-center'>{currentUser.name}</span>
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
          <div className='flex flex-wrap sm:gap-3 items-center'>
            <NavLink
              to="/"
              className={({ isActive }) => `block py-2 duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold hidden sm:block`}
              onClick={() => scrollToSection('home')}
            >
              Home
            </NavLink>
            <NavLink
              to="#"
              className={({ isActive }) => `block py-2 pr-[1vw] pl-[1vw] duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold hidden sm:block`}
              onClick={() => scrollToSection('about')}
            >
              About
            </NavLink>
            <NavLink
              to="#"
              className={({ isActive }) => `block py-2 duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold mr-2 md:mr-3 hidden sm:block`}
              onClick={() => scrollToSection('contact')}
            >
              Contact Us
            </NavLink>
            <NavLink
              to={linkValue}
              className={({ isActive }) => `block py-2 duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold mr-2 md:mr-3 block sm:hidden`}
            >
              {headerValue}
            </NavLink>
            <div className='block sm:hidden mr-4'>
              <Dropdown inline>
                <Dropdown.Item className='text-md' onClick={() => {
                  scrollToSection('home');
                  handleDropdownItemClick('Home', '/');
                }}>
                  Home
                </Dropdown.Item>
                <Dropdown.Item className='text-md' onClick={() => {
                  scrollToSection('about');
                  handleDropdownItemClick('About', '#');
                }}>
                  About
                </Dropdown.Item>
                <Dropdown.Item className='text-md' onClick={() => {
                  scrollToSection('contact');
                  handleDropdownItemClick('Contact Us', '#');
                }}>
                  Contact Us
                </Dropdown.Item>
              </Dropdown>
            </div>
            <Link to="/signin">
              <Button gradientDuoTone="purpleToPink" outline>
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