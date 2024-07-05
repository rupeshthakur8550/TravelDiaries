import React, { useEffect, useState } from 'react';
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { HiSearch } from "react-icons/hi";
import { signoutSuccess } from '../../redux/user/userSlice';
import { setSearchValue } from '../../redux/app/appSlice';

const Header = () => {
  const { currentUser } = useSelector(state => state.user);
  const [headerValue, setHeaderValue] = useState('Home');
  const [linkValue, setLinkValue] = useState('/');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Update header and link values based on user and current route
    setHeaderValue(currentUser ? 'Explore' : 'Home');
    setLinkValue(currentUser ? '/allposts' : '/');
  }, [currentUser, location.pathname]);

  useEffect(() => {
    if (currentUser) {
      setHeaderValue('Explore');
      setLinkValue('/allposts');
    } else {
      setHeaderValue('Home');
      setLinkValue('/');
    }
  }, [currentUser]);

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
    setShowSearchInput(value === 'Search Item');
    navigate(link);
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const offset = -60;
      const sectionPosition = section.offsetTop + offset;
      window.scrollTo({
        top: sectionPosition,
        behavior: 'smooth'
      });
    }
  };
  return (
    <div className={`fixed top-0 left-0 right-0 ${isHomePage ? (scrolled ? 'bg-white shadow-lg' : 'bg-transparent') : 'bg-white shadow-lg'} z-50 mx-2 mt-1 mb-2`}>
      <Navbar className={`${isHomePage ? (scrolled ? 'bg-white' : 'bg-transparent') : 'bg-white'}`}>
        <Link to='/'
          className={`whitespace-nowrap text-xl sm:text-2xl font-extrabold rounded-lg ${isHomePage && !scrolled ? 'bg-transparent text-white' : 'bg-white text-black'}`}
          style={{ fontVariant: 'unicase' }}>
          <span className='px-2 py-1 bg-gradient-to-r from-fuchsia-700 from-35% via-sky-500 via-69% to-emerald-500 to-90% rounded-lg inline-block text-transparent bg-clip-text'>
            Travel
          </span>
          Diaries
        </Link>
        {currentUser ? (
          <>
            <div className='flex items-baseline justify-evenly'>
              <div className='flex justify-center items-center lg:gap-5 md:gap-0 lg:ml-20 md:ml-0'>
                <NavLink to='/allposts' className={({ isActive }) => `px-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold font-mono text-lg hidden md:block`}>
                  Explore
                </NavLink>
                {showSearchInput && (
                  <TextInput
                    type="text"
                    placeholder="Search Items.."
                    icon={HiSearch}
                    style={{ height: "5vh", outline: "none" }}
                    onChange={(e) => {
                      dispatch(setSearchValue(e.target.value));
                    }}
                    className="border-b block w-[36vw] md:hidden ml-3"
                  />
                )}
                <TextInput
                  type="text"
                  placeholder="Search Items.."
                  icon={HiSearch}
                  style={{ height: "5vh", outline: "none" }}
                  onChange={(e) => {
                    dispatch(setSearchValue(e.target.value));
                  }}
                  className="border-b hidden md:block w-[25vw] "
                />
                <NavLink to='/addPosts' className={({ isActive }) => `px-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold font-mono text-lg hidden md:block`}>
                  Add Posts
                </NavLink>
                <NavLink to='/messages' className={({ isActive }) => `px-3 duration-200 ${isActive ? "text-orange-700" : "text-gray-700"} border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent md:border-0 hover:text-teal-600 lg:p-0 font-semibold font-mono text-lg hidden md:block`}>
                  Chat
                </NavLink>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='flex md:hidden items-center gap-1 mr-1 justify-center'>
                <Dropdown inline className='w-36' label={
                  <NavLink
                    to={linkValue}
                    className={({ isActive }) => `block py-2 duration-200 ${isActive ? "text-orange-700" : "text-gray-900"} font-semibold mr-1 md:mr-3 block sm:hidden`}
                  >
                    {headerValue === 'Search Item' ? "" : headerValue}
                  </NavLink>}>
                  <Dropdown.Item className='text-md' onClick={() => handleDropdownItemClick('Explore', '/allposts')}>
                    Explore
                  </Dropdown.Item>
                  <Dropdown.Item className='text-md' onClick={() => handleDropdownItemClick('Search Item', "/allposts")}>
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
              <h1 className={`text-sm font-medium truncate py-3 px-2 hidden lg:block`} style={{ fontVariant: "petite-caps" }}>
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
                <Link to={'/myprofile'}>
                  <Dropdown.Item className='text-md'>Profile</Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item className='text-md' onClick={handleSignout}>Sign Out</Dropdown.Item>
              </Dropdown>
            </div>
          </>
        ) : (
          <div className='flex flex-wrap items-center'>
            <NavLink
              to="/"
              className={({ isActive }) => `block py-2 px-3 duration-200 ${isActive ? (isHomePage && !scrolled ? "text-orange-400" : "text-orange-700") : (isHomePage && !scrolled ? "text-gray-200" : "text-gray-700")} font-semibold text-md hidden sm:block`}
              onClick={() => scrollToSection('home')}
            >
              Home
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) => `block py-2 pr-[1vw] pl-[1vw] px-3 duration-200 ${isActive ? (isHomePage && !scrolled ? "text-orange-400" : "text-orange-700") : (isHomePage && !scrolled ? "text-gray-200" : "text-gray-700")} font-semibold text-md hidden sm:block`}
              onClick={() => scrollToSection('about')}
            >
              About
            </NavLink>
            <NavLink
              to="/"
              className={({ isActive }) => `block py-2 px-3 duration-200 ${isActive ? (isHomePage && !scrolled ? "text-orange-400" : "text-orange-700") : (isHomePage && !scrolled ? "text-gray-200" : "text-gray-700")} font-semibold text-md mr-2 md:mr-3 hidden sm:block`}
              onClick={() => scrollToSection('contact')}
            >
              Contact Us
            </NavLink>
            <div className='block sm:hidden mr-5'>
              <Dropdown inline arrowIcon={false} className={`${isHomePage && !scrolled ? "bg-transparent" : ""}`} label={<NavLink
                to={linkValue}
                className={({ isActive }) => `block py-2 px-2 duration-200 ${isActive ? (isHomePage && !scrolled ? "text-white" : "text-orange-400") : (isHomePage && !scrolled ? "text-gray-200" : "text-gray-700")} font-semibold bg-transparent text-md block sm:hidden`}
              >
                {headerValue}
              </NavLink>}>
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
              <Button
                gradientDuoTone={(isHomePage && scrolled) || !isHomePage ? "pinkToOrange" : ''}
                outline={!isHomePage || scrolled}
                className={`${isHomePage && !scrolled ? 'bg-transparent text-white border-white' : ''}`}
              >
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </Navbar>
    </div>
  );
}

export default Header;
