import React from 'react';
import backgroundImage from '../../assets/images/Bkg1.png';
import { FaMapMarkerAlt, FaUsers, FaLeaf } from 'react-icons/fa';

const About = () => {

  return (
    <>
      <section id='about' className="banner relative overflow-hidden bg-cover bg-center flex justify-center items-center m-2  h-[205vh] md:h-[130vh] " style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="container mx-auto">
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>
          <div className="text-black text-justify md:text-center">
            <h1 className="text-2xl md:text-4xl font-mono tracking-wider text-center mb-8 mt-20"> - About Us - </h1>
            <p className="text-lg lg:text-xl mx-8 mb-4 ">
              Welcome to Travel Diaries, your ultimate destination for discovering the world through the eyes of fellow travelers.
            </p>
            <p className="text-lg lg:text-xl mx-8 mb-2 text-justify">
              At Travel Diaries, we aim to inspire, connect, and empower travelers globally. Our platform fosters a vibrant community where adventurers of all levels can share experiences, insights, and adventures. Whether you're a seasoned explorer or a first-time adventurer, Travel Diaries is your guide to exploring the world with confidence and curiosity.
            </p>
            <div className="container mx-auto px-4 py-16 flex flex-col gap-8 md:flex-row md:gap-12">
              <div className="flex flex-col items-center justify-center gap-4 bg-white shadow-md rounded-lg p-6 md:w-1/2">
                <FaMapMarkerAlt className="text-4xl text-primary" /> {/* Replace with your desired color class */}
                <h3 className="text-xl font-medium mb-2">Authentic & Trustworthy Travel Content</h3>
                <p className="text-gray-700">
                  TravelDiaries empowers travelers to share unfiltered experiences, honest reviews, and practical tips. Our verification process ensures reliable information, helping you avoid tourist traps and make informed decisions.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 bg-white shadow-md rounded-lg p-6 md:w-1/2">
                <FaUsers className="text-4xl text-primary" /> {/* Replace with your desired color class */}
                <h3 className="text-xl font-medium mb-2">Vibrant Community of Travel Enthusiasts</h3>
                <p className="text-gray-700">
                  Connect with fellow globetrotters, share travel tips, ask questions, and discover hidden gems. Build lasting travel connections and collaborate on itineraries for unforgettable trips.
                </p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4 bg-white shadow-md rounded-lg p-6 md:w-1/2">
                <FaLeaf className="text-4xl text-primary" /> {/* Replace with your desired color class */}
                <h3 className="text-xl font-medium mb-2">Championing Sustainable Travel</h3>
                <p className="text-gray-700">
                  TravelDiaries promotes eco-friendly practices and responsible exploration. Discover eco-conscious destinations, activities, and tips on minimizing waste, respecting local cultures, and supporting responsible businesses.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full overflow-hidden line-height-0 transform rotate-0" style={{ bottom: 0, left: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(121% + 1.3px)] md:h-14 md:w-[100%] h-[72px]"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
              fill="#FFFFFF"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
              fill="#FFFFFF"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
              fill="#FFFFFF"
            ></path>
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden line-height-0 transform rotate-180" style={{ bottom: 0, left: 0 }}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-[calc(121% + 1.3px)] md:h-14 md:w-[100%] h-[72px]"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
              className="shape-fill"
              fill="#FFFFFF"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
              className="shape-fill"
              fill="#FFFFFF"
            ></path>
            <path
              d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
              className="shape-fill"
              fill="#FFFFFF"
            ></path>
          </svg>
        </div>
      </section>
    </>
  );
}

export default About;
