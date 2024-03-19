import React from "react";
import backgroundImage from '../../assets/images/BackgroundImage.png';
import { Button } from '@mui/material'
const Banner = () => {
    return (
        <section className="banner relative h-screen overflow-hidden bg-cover bg-center flex justify-center items-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black to-transparent opacity-50"></div>

            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>

            <div className="banner-content text-center text-white flex flex-col justify-center">
                <h1 className="text-5xl font-medium tracking-wider mb-8">Welcome To <span className='px-2 py-1 bg-gradient-to-r from-fuchsia-700 from-20% via-sky-500 via-30% to-emerald-500 to-90% rounded-lg inline-block text-transparent bg-clip-text'>Travel Diaries</span></h1>
                <h3 className="text-xl font-semibold mb-12 border-b border-gray-400 pb-2 ml-4 mr-4">
                    We Travel not to 'Escape Life', but for Life not to 'Escape Us'
                </h3>
                <Button
                    className="self-center hover:bg-gradient-to-r from-pink-500 to-orange-500 hover:text-white md:w-[25%] w-[40%] rounded-lg"
                    style={{ color: 'white' }}
                    variant="outlined"
                    sx={{
                        borderWidth: '2px', 
                        borderColor: 'white', 
                        whiteSpace: 'nowrap'
                    }}
                >
                    Explore More
                </Button>
            </div>
        </section>
    );
};

export default Banner;
