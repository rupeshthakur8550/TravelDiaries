import React from 'react';
import { useLocation } from 'react-router-dom';

const BriefInfoPost = () => {
    const location = useLocation();
    const { post } = location.state;

    return (
        <div className="min-h-screen mt-20 px-4 lg:px-20">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
                <img
                    className="w-full h-64 object-cover"
                    src={post.imageUrl}
                    alt={post.title}
                />
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: post.description }} className="text-gray-700 mb-4" />
                    <h2 className="text-xl font-semibold mb-2">How to Reach</h2>
                    <p className="text-gray-700 mb-4">
                        {post.howToReach}
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Accessories Needed</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        {post.accessoriesNeeded.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <h2 className="text-xl font-semibold mb-2">Where to Stay</h2>
                    <p className="text-gray-700 mb-4">
                        {post.whereToStay}
                    </p>
                    <h2 className="text-xl font-semibold mb-2">What to Wear</h2>
                    <p className="text-gray-700 mb-4">
                        {post.whatToWear}
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Duration</h2>
                    <p className="text-gray-700 mb-4">
                        {post.duration}
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Best Time to Visit</h2>
                    <p className="text-gray-700 mb-4">
                        {post.bestTimeToVisit}
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Difficulty Level</h2>
                    <p className="text-gray-700 mb-4">
                        {post.difficultyLevel}
                    </p>
                    <h2 className="text-xl font-semibold mb-2">Safety Tips</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        {post.safetyTips.map((tip, index) => (
                            <li key={index}>{tip}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BriefInfoPost;
