import React from 'react'
import monsoon1 from '../../assets/images/monsoon.png';
import monsoon2 from '../../assets/images/monsoon2.png';
import sum1 from '../../assets/images/summer1.png';
import sum2 from '../../assets/images/summer2.png';
import win1 from '../../assets/images/winter1.png';
import win2 from '../../assets/images/winter2.png';
import all1 from '../../assets/images/all1.png';
import all2 from '../../assets/images/all2.png';

const Season = () => {
    return (
        <div className=' bg-gray-900 text-white mx-2 min-h-screen'>
            <div className='flex flex-col justify-center items-center'>
                <h1 className="text-2xl md:text-4xl font-mono tracking-wider text-center mt-10"> - Seasonal Beauty - </h1>
                <p className="text-lg lg:text-xl m-8 text-justify">
                    India is a "diverse and vibrant" country offering unique experieonces in each season. In winter, you can explore the "Majestic Himalayas", witness "Cultural Festivals", and enjoy the pleasant weather in places like "Rajasthan and Kerala". Summer brings opportunities for "Adventure Sports" in the mountainous regions of the north and hill stations in south, while the monsoon season paints the landscape green and offers a romantic ambiance, especially in regions like "Goa and Kerala". India stands out due to its rich culture heritage, stunning landscapes, mouthwatering cuisine and warm hospitality. Its sheer diversity, from snow-capped mountains to tropical beaches, ensures there's something for every traveler. Moreover, India's ancient history, spiritual richness and bustling cities create an unforgettable taperstry of experiences unlike anywhere else in the world.
                </p>
                <div className="flex flex-col md:flex-row justify-center items-center m-4">
                    <div className='flex flex-col  justify-center items-center gap-4'>
                        <div className='flex gap-2 justify-center'><img src={sum1} alt="tour" className="w-[40%] rounded-bl-[50px]  rounded-tr-[50px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" />
                            <img src={sum2} alt="tour" className="w-[40%] rounded-tl-[50px] rounded-br-[50px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" /></div>
                        <h1 className="text-lg md:text-2xl font-mono tracking-wider mb-8"> - Summer - </h1>
                    </div>

                    <div className='flex flex-col  justify-center items-center gap-4'>
                        <div className='flex gap-2 justify-center'><img src={monsoon1} alt="tour" className="w-[40%] rounded-br-[50px] rounded-tl-[50px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" />
                            <img src={monsoon2} alt="tour" className="w-[40%] rounded-tr-[50px] rounded-bl-[50px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" /></div>
                        <h1 className="text-lg md:text-2xl font-mono tracking-wider mb-8"> - Monsoon - </h1>
                    </div>

                    <div className='flex flex-col  justify-center items-center gap-4'>
                        <div className='flex gap-2 justify-center'><img src={win1} alt="tour" className="w-[40%] rounded-bl-[50px]  rounded-tr-[50px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" />
                            <img src={win2} alt="tour" className="w-[40%] rounded-tl-[50px] rounded-br-[50px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" /></div>
                        <h1 className="text-lg md:text-2xl font-mono tracking-wider mb-8"> - Winter - </h1>
                    </div>
                    <div className='flex flex-col  justify-center items-center gap-4'>
                        <div className='flex gap-2 justify-center'><img src={all1} alt="tour" className="w-[40%] rounded-br-[50px]  rounded-tl-[50px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" />
                            <img src={all2} alt="tour" className="w-[40%] rounded-tr-[50px] rounded-bl-[50px] h-[70%] transition duration-300 transform hover:scale-105 hover:rounded-none" /></div>
                        <h1 className="text-lg md:text-2xl font-mono tracking-wider mb-8"> - All Season - </h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Season