// SearchResults.jsx

import React from 'react';
import { MdCancel } from "react-icons/md";
import { Avatar } from 'flowbite-react';

const SearchResults = ({ results, handleSelectUser, handleCancel }) => {
    return (
        <div className='my-1 absolute w-[100%] bg-white shadow-md rounded px-4 py-2 max-h-96 overflow-y-auto z-10'>
            <div className='flex justify-between items-center'>
                <h1 className={`text-sm font-medium truncate lg:block py-1 pr-4 pl-3`} style={{ fontVariant: "petite-caps" }}>
                    Search Results :
                </h1>
                <button onClick={handleCancel}><MdCancel className='w-5 h-5' /></button>
            </div>
            <hr className="my-2 border-t-2 border-gray-300" />
            {results.length > 0 ? (
                <ul className="flex flex-col gap-1 my-2">
                    {results.map((result) => (
                        <li key={result._id} className="flex items-center cursor-pointer bg-gray-200 hover:bg-blue-300 text-black px-1 py-2 mb-2 rounded-lg" onClick={() => handleSelectUser(result._id)}>
                            <Avatar
                                alt='user'
                                img={result.profilePicture}
                                rounded
                                className="w-10 h-6 mr-2"
                            />
                            <span>{result.username}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <ul className="flex flex-col gap-4">
                    <li className="flex items-center">
                        <span> No User Found </span>
                    </li>
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
