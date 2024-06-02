import React from "react";
import { MdAccessibilityNew, MdHail, MdLiquor, MdPrivateConnectivity } from 'react-icons/md';
import benefit1 from '../../assets/images/set1.png';
import benefit2 from '../../assets/images/set2.png';

const Commitments = () => {
    return (
        <div className="container mx-auto px-4 mt-10 mb-10" >
            <div className="mb-8">
                <h1 className="text-2xl md:text-4xl font-mono tracking-wider mb-12 text-center"> - Our Commitments - </h1>
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex justify-center items-center gap-2 md:w-2/4 mb-4 md:mr-2">
                    <img src={benefit1} alt="tour" className="w-[40%] rounded-bl-[120px] rounded-tr-[20px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" />
                    <img src={benefit2} alt="tour" className="w-[40%] rounded-tr-[120px] rounded-bl-[20px] transition duration-300 transform hover:scale-105 hover:rounded-none" />
                </div>
                <div className="md:w-1/2 text-center md:text-left gap-3">
                    <p className="text-lg lg:text-xl mb-12 text-justify">
                        Travel Diaries is dedicated to providing an enriching platform where users can preserve their travel memories and facilitate future adventures.
                    </p>
                    <div className="flex flex-wrap justify-between mr-2 ml-2">
                        <div className="w-full sm:w-[45%] h-[150px] mb-12">
                            <h4 className="flex items-center text-blue-600 font-semibold mb-4">
                                <MdAccessibilityNew className="mr-2" />
                                Own Pace
                            </h4>
                            <p className="text-justify">
                                Travel Diaries empowers users to travel at their own pace. Whether it's exploring bustling cities or tranquil landscapes, users can plan their journeys according to their preferences and schedules.
                            </p>
                        </div>
                        <div className="w-full sm:w-[45%] h-[150px] mb-12">
                            <h4 className="flex items-center text-blue-600 font-semibold mb-4">
                                <MdLiquor className="mr-2" />
                                Complements
                            </h4>
                            <p className="text-justify">
                                Enhance your travel experiences with Travel Diaries' curated suggestions and VIP Experiences. Discover unique adventures tailored to your tastes, making every journey unforgettable.
                            </p>
                        </div>
                        <div className="w-full sm:w-[45%] h-[150px] mb-12">
                            <h4 className="flex items-center text-blue-600 font-semibold mb-4">
                                <MdPrivateConnectivity className="mr-2" />
                                Secured
                            </h4>
                            <p className="text-justify">
                                Your privacy and security are our top priorities at Travel Diaries. We employ robust measures to safeguard your personal information, ensuring a safe and confidential environment for all users.
                            </p>
                        </div>
                        <div className="w-full sm:w-[45%] h-[150px] mb-12">
                            <h4 className="flex items-center text-blue-600 font-semibold mb-4">
                                <MdHail className="mr-2" />
                                Guidance
                            </h4>
                            <p className="text-justify">
                                Receive personalized guidance and insider tips from fellow travelers through Travel Diaries' chat section. Connect with like-minded individuals, share invaluable insights, and embark on transformative journeys together.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>

    );
};

export default Commitments;
