import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { Button, Card, Dropdown, Modal } from 'flowbite-react';
import { useDispatch, useSelector } from 'react-redux';
import { CiMenuKebab } from "react-icons/ci";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { setSelectedChat } from '../../redux/chat/chatSlice';
import { formatDistanceToNow, format } from 'date-fns';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const MyPosts = () => {
  const dispatch = useDispatch();
  const { currentUser, error } = useSelector(state => state.user);
  const [posts, setPosts] = useState([]);
  const [deleteShowModal, setDeleteShowModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== '/messages') {
      dispatch(setSelectedChat(null));
    }
  }, [location.pathname, dispatch]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/post/getuserposts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleCardClick = (post) => {
    navigate('/briefinfopost', { state: { post } });
  };

  const handleEdit = (post) => {
    // Handle edit
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

  const handleDelete = (postId) => {
    setPostToDelete(postId);
    setDeleteShowModal(true);
  };

  const confirmDelete = async () => {
    if (postToDelete) {
      try {
        const res = await fetch(`/api/post/deletepost/${postToDelete}`, {
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

  return (
    <>
      <div className='md:w-[50%] lg:w-[26%] sm:w-[60%] w-[90%] mx-auto pt-12 md:pt-14 mt-10'>
        <div className='flex px-4 justify-between py-3 gap-6 md:gap-8 mb-1'>
          <img className="w-16 h-16 rounded-full" src={currentUser.profilePicture} alt="User Profile" />
          <div>
            <Typography variant='h5' className='text-nowrap'>{currentUser.name}</Typography>
            <Typography>@{currentUser.username}</Typography>
          </div>
          <div>
            <Typography variant='h5'>Posts</Typography>
            <Typography className='text-center' style={{ fontSize: '20px' }}>{currentUser && posts.length || 0}</Typography>
          </div>
        </div>
        <Typography className='text-center pb-4 text-base md:text-lg px-3'>{currentUser.bio}</Typography>
        <NavLink to='/dashboard?tab=profile'>
          <Button gradientDuoTone="pinkToOrange" outline type='submit' className='w-[90%] md:w-96 md:self-center mx-auto'>
            Edit Profile
          </Button>
        </NavLink>
      </div>
      <div className="flex flex-col items-center gap-4 p-4 mt-5">
        {posts.map((post) => (
          <Card key={post._id}
            className={`${!post.visibility ? 'filter grayscale' : ''} w-full max-w-4xl mx-auto mb-4`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {post.userId && (
                  <>
                    <img src={currentUser.profilePicture} alt={currentUser.username} className="w-10 h-10 rounded-full" />
                    <div className='flex flex-col'>
                      <div className='flex gap-3' style={{ fontFamily: 'monospace' }}>
                        <span className="ml-4 font-semibold">{currentUser.username}</span>
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
                <Dropdown.Item className='text-md font-semibold justify-center' onClick={() => handleEdit(post)}>
                  Update
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className='text-md font-semibold text-red-700 justify-center' onClick={() => handleDelete(post._id)}>
                  Delete
                </Dropdown.Item>
              </Dropdown>
            </div>
            <h2 className="text-2xl font-semibold text-center">{post.title}</h2>
            <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover cursor-pointer" onClick={() => handleCardClick(post)} />
            <div className="p-4">
              <div dangerouslySetInnerHTML={{ __html: post.description }} className="text-gray-700 mb-4" />
              <h4 className="font-semibold text-gray-800 block sm:hidden">Location : <span className=' font-medium text-black'>{post.location}</span></h4>
              <h4 className="font-semibold text-gray-800 block sm:hidden">Category : <span className=' font-medium text-black'>{post.category}</span></h4>
            </div>
          </Card>
        ))}
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

export default MyPosts;
