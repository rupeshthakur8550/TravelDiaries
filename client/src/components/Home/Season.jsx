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
        <div>
            <h1 className="text-2xl md:text-4xl font-mono tracking-wider text-center m-10"> - Seasonal Beauty - </h1>
            <div className="flex flex-col md:flex-row justify-center items-center m-4">
            <div className='flex flex-col  justify-center items-center gap-4'>
                    <div className='flex gap-2 justify-center'><img src={sum1} alt="tour" className="w-[40%] rounded-bl-[50px]  rounded-tr-[50px] h-[70%]" />
                        <img src={sum2} alt="tour" className="w-[40%] rounded-tl-[50px] rounded-br-[50px] h-[70%]" /></div>
                    <h1 className="text-lg md:text-2xl font-mono tracking-wider mb-12"> - Summer - </h1>
                </div>

                <div className='flex flex-col  justify-center items-center gap-4'>
                    <div className='flex gap-2 justify-center'><img src={monsoon1} alt="tour" className="w-[40%] rounded-br-[50px]  rounded-tl-[50px] h-[70%]" />
                        <img src={monsoon2} alt="tour" className="w-[40%] rounded-tr-[50px] rounded-bl-[50px] h-[70%]" /></div>
                    <h1 className="text-lg md:text-2xl font-mono tracking-wider mb-12"> - Monsoon - </h1>
                </div>
                
                <div className='flex flex-col  justify-center items-center gap-4'>
                    <div className='flex gap-2 justify-center'><img src={win1} alt="tour" className="w-[40%] rounded-bl-[50px]  rounded-tr-[50px] h-[70%]" />
                        <img src={win2} alt="tour" className="w-[40%] rounded-tl-[50px] rounded-br-[50px] h-[70%]" /></div>
                    <h1 className="text-lg md:text-2xl font-mono tracking-wider mb-12"> - Winter - </h1>
                </div>
                <div className='flex flex-col  justify-center items-center gap-4'>
                    <div className='flex gap-2 justify-center'><img src={all1} alt="tour" className="w-[40%] rounded-br-[50px]  rounded-tl-[50px] h-[70%]" />
                        <img src={all2} alt="tour" className="w-[40%] rounded-tr-[50px] rounded-bl-[50px] h-[70%]" /></div>
                    <h1 className="text-lg md:text-2xl font-mono tracking-wider mb-12"> - All Season - </h1>
                </div>

            </div>
        </div>
    )
}

export default Season