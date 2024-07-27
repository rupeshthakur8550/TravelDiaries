import { Sidebar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { HiUser, HiArrowRight } from 'react-icons/hi';
import { MdAdminPanelSettings, MdDynamicFeed } from "react-icons/md";
import { HiUsers } from "react-icons/hi2";
import { signoutSuccess } from '../../redux/user/userSlice'
import { useDispatch, useSelector } from 'react-redux';

function DashSidebar() {
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

    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST'
            });
            const data = await res.json();
            if (!res.ok) {
                console.log(data.mesaage);
            } else {
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.mesaage);
        }
    }
    return (
        <Sidebar className='w-full md:w-56 md:mt-16' style={{ boxShadow: '0px 10px 10px 0px #aaaaaa' }}>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/dashboard?tab=profile'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? "Admin" : "User"} labelColor="dark" as='div' >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser.isAdmin &&
                        <>
                            <Link to='/dashboard?tab=dashboard'>
                                <Sidebar.Item active={tab === 'dashboard'} icon={MdAdminPanelSettings} as='div' >
                                    Dashboard
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=allposts'>
                                <Sidebar.Item active={tab === 'allposts'} icon={MdDynamicFeed} as='div' >
                                    All Posts
                                </Sidebar.Item>
                            </Link>
                            <Link to='/dashboard?tab=allusers'>
                                <Sidebar.Item active={tab === 'allusers'} icon={HiUsers} as='div' >
                                    All Users
                                </Sidebar.Item>
                            </Link>
                        </>
                    }
                    <Sidebar.Item icon={HiArrowRight} className="cursor-pointer" onClick={handleSignOut}>
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
}

export default DashSidebar;

//5:38:00 resume for admin functionality
