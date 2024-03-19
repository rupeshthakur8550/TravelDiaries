import React from "react";
import imagebkg from '../../assets/images/Bkg1.png';

const Services = () => {
    return (
        <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1/5 bg-gradient-to-b from-black to-transparent opacity-40"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/5 bg-gradient-to-t from-black to-transparent opacity-40"></div>

            <div className="flex justify-center items-center flex-col gap-8 pl-8 pr-8 pt-8 pb-8 md:flex-row md:items-center md:gap-8" style={{ backgroundImage: `url(${imagebkg})`, minHeight: '400px', backgroundSize: 'cover' }} >
                <div className="review-item py-4 bg-black bg-opacity-20 rounded-lg shadow-md px-6 md:w-1/3">
                    <div className="text-justify text-white">
                        <p className="star"><br /> Travel Assistance 24/7</p>
                        <p className="mb-4">Our dedicated team is available round-the-clock to assist you with your travel queries and needs. Whether it's booking accommodations, arranging transportation, or providing destination recommendations, we're here to ensure your journey is seamless and enjoyable.</p>
                    </div>
                </div>
                <div className="review-item py-4 bg-black bg-opacity-20 rounded-lg shadow-md px-6 md:w-1/3">
                    <div className="text-justify text-white">
                        <p className="star"><br /> Community Chat Lounge</p>
                        <p className="mb-4">Connect with fellow travelers through our interactive chat lounge. Share experiences, exchange travel tips, and gather insights from like-minded individuals. Whether you're seeking insider recommendations or simply want to engage with a vibrant travel community, our chat lounge is the perfect platform for interaction.</p>
                    </div>
                </div>
                <div className="review-item py-4 bg-black bg-opacity-20 rounded-lg shadow-md px-6 md:w-1/3">
                    <div className="text-justify text-white">
                        <p className="star"><br /> Personalized Travel Planning</p>
                        <p className="mb-4">Tailor your travel experiences with our personalized planning service. Our experts will curate custom itineraries based on your preferences, interests, and budget. Whether you're seeking adventurous escapades, cultural explorations, or leisurely getaways, we'll craft the perfect journey for you. Experience hassle-free travel planning and embark on unforgettable adventures with Travel Diaries.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;
