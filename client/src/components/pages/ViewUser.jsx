import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Button, Card } from 'flowbite-react';
import { useLocation, useNavigate } from 'react-router-dom';

const formatPostDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const ViewUser = () => {
    const location = useLocation();
    const { userId } = location.state;
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch(`/api/user/getuserdetails/${userId}`);
            const data = await res.json();
            setUser(data);
        };
        fetchUser();
    }, [userId]);

    const handleCardClick = (post) => {
        navigate('/briefinfopost', { state: { post } });
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className='md:w-[50%] lg:w-[26%] sm:w-[60%] w-[90%] mx-auto pt-12 md:pt-14 mt-10'>
                <div className='flex px-4 justify-between py-3 gap-6 md:gap-8 mb-1'>
                    <img className="w-16 h-16 rounded-full" src={user.profilePicture} alt="User Profile" />
                    <div>
                        <Typography variant='h5' className='text-nowrap'>{user.name}</Typography>
                        <Typography>@{user.username}</Typography>
                    </div>
                    <div>
                        <Typography variant='h5'>Posts</Typography>
                        <Typography className='text-center' style={{ fontSize: '20px' }}>{user.posts.length}</Typography>
                    </div>
                </div>
                <Typography className='text-center pb-4 text-base md:text-lg px-3'>{user.bio}</Typography>
                <Button gradientDuoTone="pinkToOrange" outline type='submit' className='w-[90%] md:w-96 md:self-center mx-auto'>
                    Message User
                </Button>
            </div>
            <div className="flex flex-col items-center gap-4 p-4 mt-5">
                {user.posts.map((post) => (
                    <Card key={post._id}
                        className='w-full max-w-4xl mx-auto mb-4'
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <img src={user.profilePicture} alt={user.username} className="w-10 h-10 rounded-full" />
                                <div className='flex flex-col'>
                                    <div className='flex gap-3' style={{ fontFamily: 'monospace' }}>
                                        <span className="ml-4 font-semibold">{user.username}</span>
                                        <span className="font-semibold text-gray-800 hidden sm:block"> | {post.location}</span>
                                        <span className="font-semibold text-gray-800 hidden sm:block">| {post.category}</span>
                                    </div>
                                    <div className='mt-[-6px]'>
                                        <span className="ml-4 font-semibold text-xs">{formatPostDate(post.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-center">{post.title}</h2>
                        <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover cursor-pointer" onClick={() => handleCardClick(post)} />
                        <div className="p-4">
                            <div dangerouslySetInnerHTML={{ __html: post.description }} className="text-gray-700 mb-4" />
                            <h4 className="font-semibold text-gray-800 block sm:hidden">Location : <span className='font-medium text-black'>{post.location}</span></h4>
                            <h4 className="font-semibold text-gray-800 block sm:hidden">Category : <span className='font-medium text-black'>{post.category}</span></h4>
                        </div>
                    </Card>
                ))}
            </div>
        </>
    );
};

export default ViewUser;
