import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Dropdown, Modal, Spinner } from 'flowbite-react';
import { setSelectedChat } from '../../redux/chat/chatSlice';
import { formatDistanceToNow, format } from 'date-fns';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { CiMenuKebab } from "react-icons/ci";
import { useDispatch, useSelector } from 'react-redux';

const DashPosts = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector(state => state.user);
    const { searchValue } = useSelector(state => state.app);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteShowModal, setDeleteShowModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const location = useLocation();
    const isBriefInfo = location.pathname.includes('briefinfo');
    const loggedInUserId = currentUser._id;

    useEffect(() => {
        if (location.pathname !== '/messages') {
            dispatch(setSelectedChat(null));
        }
    }, [location.pathname, dispatch]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                let response;
                if (searchValue) {
                    response = await fetch(`/api/post/searchposts?search=${searchValue}`);
                } else {
                    response = await fetch('/api/post/getallposts');
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                let data = await response.json();

                if (!Array.isArray(data)) {
                    throw new Error('Fetched data is not an array');
                }

                setPosts(data);
                setLoading(false);
            } catch (error) {
                console.error(error.message);
                setError(error.message);
                setLoading(false);
            }
        };
        fetchPosts();
    }, [searchValue, loggedInUserId]);

    if (loading) {
        return <div className="flex justify-center items-center min-h-screen"><Spinner /></div>;
    }

    if (error) {
        return <div className="flex justify-center items-center min-h-screen"><p>{error}</p></div>;
    }

    const handleCardClick = (post) => {
        navigate('/briefinfopost', { state: { post } });
    };

    const formatPostDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const differenceInDays = (now - date) / (1000 * 60 * 60 * 24);

        if (differenceInDays > 7) {
            return format(date, 'dd/MM/yyyy');
        } else {
            return formatDistanceToNow(date, { addSuffix: true });
        }
    };

    const handleAvailability = async (postId, currentVisibility) => {
        try {
            const res = await fetch(`/api/post/postvisibility/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ visibility: !currentVisibility }),
            });

            if (res.ok) {
                setPosts(posts.map(post => post._id === postId ? { ...post, visibility: !currentVisibility } : post));
            } else {
                console.error("Error updating post visibility");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = (post) => {
        setPostToDelete(post);
        setDeleteShowModal(true);
    };

    const confirmDelete = async () => {
        if (postToDelete) {
            try {
                const storage = getStorage(app);
                const existingImageRef = ref(storage, postToDelete.imageUrl);
                await deleteObject(existingImageRef);
                const res = await fetch(`/api/post/deletepost/${postToDelete._id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    setPosts(posts.filter(post => post._id !== postToDelete));
                    setDeleteShowModal(false);
                    setPostToDelete(null);
                } else {
                    console.error("Error deleting post");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    return (
        <>
            <div className='min-h-screen'>
                {!isBriefInfo &&
                    <div className="flex flex-col items-center gap-4 p-4">
                        {posts.map((post) => (
                            <Card key={post._id} className={`${!post.visibility ? 'filter grayscale' : ''} w-full max-w-7xl mx-auto mb-4`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        {post.userId && (
                                            <>
                                                <img src={post.userId.profilePicture} alt={post.userId.username} className="w-10 h-10 rounded-full"
                                                />
                                                <div className='flex flex-col'>
                                                    <div className='flex gap-3' style={{ fontFamily: 'monospace' }}>
                                                        <span className="ml-4 font-semibold" onClick={() => navigate(`/viewuser`, { state: { userId: post.userId._id } })}>{post.userId.username}</span>
                                                        <span className=" font-semibold text-gray-800 hidden sm:block"> | {post.location}</span>
                                                        <span className=" font-semibold text-gray-800 hidden sm:block">| {post.category}</span>
                                                    </div>
                                                    <div className='mt-[-6px]'>
                                                        <span className="ml-4 font-semibold text-xs">{formatPostDate(post.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <Dropdown
                                        arrowIcon={false}
                                        inline
                                        label={<CiMenuKebab />}
                                        className='w-32'
                                    >
                                        <Dropdown.Header
                                            className={`${!post.visibility ? 'text-green-700' : 'text-blue-700'} text-md font-semibold text-center cursor-pointer`}
                                            onClick={() => handleAvailability(post._id, post.visibility)}
                                        >
                                            {post.visibility ? 'Archive' : 'Unarchive'}
                                        </Dropdown.Header>
                                        <Dropdown.Divider />
                                        <Dropdown.Item className='text-md font-semibold text-red-700 justify-center' onClick={() => handleDelete(post)}>
                                            Delete
                                        </Dropdown.Item>
                                    </Dropdown>
                                </div>
                                <div onClick={() => handleCardClick(post)}>
                                    <h2 className="text-2xl font-semibold text-center mb-4">{post.title}</h2>
                                    <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
                                    <div className="p-4">
                                        <div dangerouslySetInnerHTML={{ __html: post.description }} className="text-gray-700 mb-4" />
                                        <h4 className="font-semibold text-gray-800 block sm:hidden">Location : <span className=' font-medium text-black'>{post.location}</span></h4>
                                        <h4 className="font-semibold text-gray-800 block sm:hidden">Category : <span className=' font-medium text-black'>{post.category}</span></h4>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>}
                <Outlet />
            </div>
            <Modal show={deleteShowModal} onClose={() => setDeleteShowModal(false)} popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-500 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-700'>
                            Are you sure you want to let go of this cherished and irreplaceable memory?
                        </h3>
                        <p className='mb-5 text-gray-700 text-justify'>
                            🌟 This memory holds fragments of laughter and lessons etched into your soul. It has woven itself into the tapestry of your life, dancing with joy and weathering storms. Perhaps it's time to release it, allowing space for new memories to bloom. 🌸
                        </p>
                        <div className='flex justify-center gap-5'>
                            <Button color='failure' onClick={confirmDelete}>Yes, I'm sure</Button>
                            <Button color='gray' onClick={() => setDeleteShowModal(false)}>No, cancel</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default DashPosts;
