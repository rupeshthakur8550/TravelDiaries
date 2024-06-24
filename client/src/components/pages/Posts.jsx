import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Card, Spinner } from 'flowbite-react';
import { setSelectedChat } from '../../redux/chat/chatSlice';
import { useDispatch, useSelector } from 'react-redux';

const Posts = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.user);
  const { searchValue } = useSelector(state => state.app);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
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

        const filteredPosts = data.filter(post => post.userId._id !== loggedInUserId);

        setPosts(filteredPosts);
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

  return (
    <>
      <div className='min-h-screen mt-20'>
        {!isBriefInfo &&
          <div className="flex flex-col items-center gap-4 p-4">
            {posts.map((post) => (
              <Card key={post._id} className="w-full max-w-4xl mx-auto mb-4 cursor-pointer" onClick={() => handleCardClick(post)}>
                <div className="flex items-center">
                  {post.userId && (
                    <>
                      <img src={post.userId.profilePicture} alt={post.userId.username} className="w-10 h-10 rounded-full" />
                      <span className="ml-4 font-semibold">{post.userId.username}</span>
                      <span className="ml-4 font-semibold text-gray-800 hidden sm:block"> | {post.location}</span>
                      <span className="ml-4 font-semibold text-gray-800 hidden sm:block">| {post.category}</span>
                    </>
                  )}
                </div>
                <h2 className="text-2xl font-semibold text-center">{post.title}</h2>
                <img src={post.imageUrl} alt={post.title} className="w-full h-64 object-cover" />
                <div className="p-4">
                  <div dangerouslySetInnerHTML={{ __html: post.description }} className="text-gray-700 mb-4" />
                  <h4 className="font-semibold text-gray-800 block sm:hidden">Location : <span className=' font-medium text-black'>{post.location}</span></h4>
                  <h4 className="font-semibold text-gray-800 block sm:hidden">Category : <span className=' font-medium text-black'>{post.category}</span></h4>
                </div>
              </Card>
            ))}
          </div>}
        <Outlet />
      </div>
    </>
  );
}

export default Posts;
