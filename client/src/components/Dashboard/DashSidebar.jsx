import { Sidebar } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { HiUser, HiArrowRight } from 'react-icons/hi';
import {signoutSuccess} from '../../redux/user/userSlice'
import { useDispatch } from 'react-redux';

function DashSidebar() {
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

    const handleSignOut = async()=>{
        try {
            const res = await fetch('/api/user/signout',{
                method: 'POST'
            });
            const data = await res.json();
            if( !res.ok){
                console.log(data.mesaage);
            }else{
                dispatch(signoutSuccess());
            }
        } catch (error) {
            console.log(error.mesaage);
        }
    }
    return (
        <Sidebar className='w-full md:w-56 md:mt-16' style={{boxShadow: '0px 10px 10px 0px #aaaaaa'}}>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to='/myposts'>
                        <Sidebar.Item active={tab === 'profile'} icon={HiUser} label="User" labelColor="dark" as='div' >
                            Profile
                        </Sidebar.Item>
                    </Link>
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
