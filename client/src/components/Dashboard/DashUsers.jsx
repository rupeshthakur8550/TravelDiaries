import React, { useEffect, useState } from 'react';
import { Dropdown } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { CiMenuKebab } from "react-icons/ci";

const DashUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/user/getalluser', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }

                const data = await response.json();

                if (Object.keys(data).length !== 0) {
                    setUsers(data);
                } else {
                    setError('Access denied. You are not authorized to view this page.');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-2xl font-semibold text-gray-700">Loading users...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-2 w-full">
            {/* Table for larger screens */}
            <div className="hidden md:block overflow-x-auto rounded-lg shadow-lg border border-gray-300 bg-white">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 font-semibold text-sm">
                            <th className="py-4 px-6 border-b">Profile</th>
                            <th className="py-4 px-6 border-b">Username</th>
                            <th className="py-4 px-6 border-b">Name</th>
                            <th className="py-4 px-6 border-b">Bio</th>
                            <th className="py-4 px-6 border-b">Posts</th>
                            <th className="py-4 px-6 border-b">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="py-4 px-6 border-b text-gray-700">
                                    <img
                                        src={user.profilePicture}
                                        alt={`${user.username}'s profile`}
                                        className="md:w-12 md:h-12 w-10 h-10 rounded-full object-cover"
                                    />
                                </td>
                                <td className="py-4 px-6 border-b text-gray-700 text-nowrap md:text-base text-sm cursor-pointer" onClick={() => navigate(`/viewuser`, { state: { userId: user._id } })}>{user.username}</td>
                                <td className="py-4 px-6 border-b text-gray-700 text-nowrap md:text-base text-sm">{user.name}</td>
                                <td className="py-4 px-6 border-b text-gray-700 md:text-base text-sm">{user.bio || 'N/A'}</td>
                                <td className="py-4 px-6 border-b text-gray-700 text-nowrap md:text-base text-sm">{user.posts.length} posts</td>
                                <td className="py-4 px-6 border-b">
                                    <Dropdown label="Action" inline arrowIcon={false} size="sm">
                                        <Dropdown.Item className='text-orange-600'>
                                            Block User
                                        </Dropdown.Item>
                                        <Dropdown.Item className='text-red-600'>
                                            Delete User
                                        </Dropdown.Item>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Card layout for smaller screens */}
            <div className="block md:hidden">
                {users.map((user) => (
                    <div
                        key={user._id}
                        className="border border-gray-300 rounded-lg shadow-md mb-4 p-4 bg-white relative"
                    >
                        {/* Action Menu Icon - Positioned at the top right */}
                        <div className="absolute top-3 right-2">
                            <Dropdown
                                arrowIcon={false}
                                inline
                                label={<CiMenuKebab className="cursor-pointer" />}
                            >
                                <Dropdown.Item className="text-orange-600 text-nowrap">
                                    Block User
                                </Dropdown.Item>
                                <Dropdown.Item className="text-red-600 text-nowrap">
                                    Delete User
                                </Dropdown.Item>
                            </Dropdown>
                        </div>

                        {/* Profile Section */}
                        <div className="flex items-center justify-center mb-3">
                            <img
                                src={user.profilePicture}
                                alt={`${user.username}'s profile`}
                                className="w-14 h-14 rounded-full object-cover mr-4"
                            />
                            <div>
                                <span className="font-semibold text-gray-800">{user.name}</span>
                                <div
                                    className="text-sm text-gray-600 cursor-pointer"
                                    onClick={() =>
                                        navigate(`/viewuser`, { state: { userId: user._id } })
                                    }
                                >
                                    @{user.username}
                                </div>
                            </div>
                        </div>

                        {/* Bio Section */}
                        <p className="text-sm text-center my-3 text-gray-700">
                            {user.bio || 'N/A'}
                        </p>

                        {/* Posts Count */}
                        <div className="flex justify-center mb-3">
                            <div className="text-base text-gray-600">
                                <span className="font-bold">Posts:</span> {user.posts.length} posts
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DashUsers;
