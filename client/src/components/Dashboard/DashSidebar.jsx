import { Sidebar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import { MdDynamicFeed } from "react-icons/md";
import { HiUsers, HiHome, HiUserCircle } from "react-icons/hi2";
import { signoutSuccess } from '../../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedDashboard } from '../../redux/app/appSlice';

const DashSidebar = () => {
    const { currentUser } = useSelector(state => state.user);
    const location = useLocation();
    const [tab, setTab] = useState('');
    const dispatch = useDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        if (tabFromUrl) {
            setTab(tabFromUrl);
        }
    }, [location.search]);

    useEffect(() => {
        dispatch(setSelectedDashboard(tab));
    }, [tab, dispatch]);

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
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

    return (
        <Sidebar className={`sm:w-48 md:w-56 sm:mt-20 mx-5 h-[87vh] border-2 shadow-md border-gray-300 rounded-md`}>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    {currentUser.isAdmin ? (
                        <>
                            <Link to="/dashboard?tab=dashboard">
                                <Sidebar.Item icon={HiHome} active={tab === 'dashboard'} as="div">
                                    Dashboard
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=profile'>
                                <Sidebar.Item active={tab === 'profile'} icon={HiUserCircle} label={currentUser.isAdmin ? "Admin" : "User"} labelColor="dark" as='div'>
                                    Profile
                                </Sidebar.Item>
                            </Link>
                            <Link to="/dashboard?tab=updateProfile">
                                <Sidebar.Item active={tab === 'updateProfile'} icon={HiArrowRight} as='div'>
                                    Update Profile
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=allposts'>
                                <Sidebar.Item active={tab === 'allposts'} icon={MdDynamicFeed} as='div'>
                                    All Posts
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=allusers'>
                                <Sidebar.Item active={tab === 'allusers'} icon={HiUsers} as='div'>
                                    All Users
                                </Sidebar.Item>
                            </Link>
                            <Sidebar.Item icon={HiArrowRight} className="cursor-pointer" onClick={handleSignOut}>
                                Sign Out
                            </Sidebar.Item>
                        </>
                    ) : (
                        <>
                            <Link to='/dashboard?tab=profile'>
                                <Sidebar.Item active={tab === 'profile'} icon={HiUserCircle} label={currentUser.isAdmin ? "Admin" : "User"} labelColor="dark" as='div'>
                                    Profile
                                </Sidebar.Item>
                            </Link>
                            <Sidebar.Item icon={HiArrowRight} className="cursor-pointer" onClick={handleSignOut}>
                                Sign Out
                            </Sidebar.Item>
                        </>
                    )}
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default DashSidebar;
