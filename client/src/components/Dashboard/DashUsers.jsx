import React, { useEffect, useState } from 'react';
import { Dropdown } from 'flowbite-react';

const DashUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        <div className="p-1 w-full">
            <div className="overflow-x-auto rounded-lg shadow-lg border border-gray-300 bg-white">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gray-100 text-left text-gray-600 font-semibold text-sm">
                            <th className="py-4 px-6 border-b">Profile</th>
                            <th className="py-4 px-6 border-b">Username</th>
                            <th className="py-4 px-6 border-b">Name</th>
                            <th className="py-4 px-6 border-b">Bio</th>
                            <th className="py-4 px-6 border-b">Posts</th>
                            <th className="py-4 px-6 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-200">
                                <td className="py-4 px-6 border-b text-gray-700">
                                    <img
                                        src={user.profilePicture}
                                        alt={`${user.username}'s profile`}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                </td>
                                <td className="py-4 px-6 border-b text-gray-700 text-nowrap md:text-base text-sm">{user.username}</td>
                                <td className="py-4 px-6 border-b text-gray-700 text-nowrap md:text-base text-sm">{user.name}</td>
                                <td className="py-4 px-6 border-b text-gray-700 md:text-base text-sm">{user.bio || 'N/A'}</td>
                                <td className="py-4 px-6 border-b text-gray-700 text-nowrap md:text-base text-sm">{user.posts.length} posts</td>
                                <td className="py-4 px-6 border-b">
                                    <Dropdown label="Actions" inline arrowIcon={false} size="sm">
                                        <Dropdown.Item>
                                            View Profile
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            Edit User
                                        </Dropdown.Item>
                                        <Dropdown.Item>
                                            Delete User
                                        </Dropdown.Item>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DashUsers;
