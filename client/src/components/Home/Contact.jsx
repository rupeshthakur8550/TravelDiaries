import React, { useState } from 'react'
import { TextInput, Button, Textarea, Dropdown } from 'flowbite-react'
import backgroundImage from '../../assets/images/Bkg2.png';
import { MdEmail, MdPhone } from 'react-icons/md';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        subject: '',
        query: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (!res.ok || data.success === false) {
                console.log(data.message);
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    return (
        <section id='contact' className="banner relative h-screen overflow-hidden bg-cover bg-center m-2 z-50" style={{ backgroundImage: `url(${backgroundImage})`, height: '100vh', display: 'flow', alignContent: 'center' }}>
            <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black to-transparent opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black to-transparent opacity-50"></div>

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

            <h1 className="text-2xl md:text-4xl font-mono tracking-wider text-center my-10"> - Reach Us Out - </h1>

            <div className="text-white text-justify md:text-center">
                <p className="mx-5 text-xl font-mono">
                    Our platform offers a space for travelers to share experiences and memories, fostering a community where all can contribute.
                </p>
                <p className='mx-5 text-lg font-mono'>
                    Feel free to reach out to us with any inquiries, feedback, or collaboration opportunities. We're excited to hear from you!
                </p>
            </div>

            <div className='md:flex flex-row justify-evenly items-center m-5 mt-10 gap-5'>
                <div className='md:w-[40%] backdrop-filter backdrop-blur-0 bg-black bg-opacity-20 rounded-lg shadow-md px-6 w-full sm:w-auto'>
                    <form className='flex flex-col items-center gap-4 mt-10 mb-10' onSubmit={handleSubmit}>
                        <TextInput type='text' id='name' placeholder='Full Name' onChange={handleChange} className='w-[90%]' />
                        {/* <TextInput type='text' id='username' placeholder='Username' onChange={handleChange} className='w-[90%]' /> */}
                        <TextInput type='email' id='email' placeholder='Email' onChange={handleChange} className='w-[90%]' />
                        {/* <TextInput type='text' id='subject' placeholder='Subject' onChange={handleChange} className='w-[90%]' /> */}
                        <Textarea type='text' id='message' placeholder='Message' onChange={handleChange} className='w-[90%]' />
                        <Button gradientDuoTone="pinkToOrange" outline type='submit' className='w-[90%] font-mono'>
                            SUBMIT MESSAGE
                        </Button>
                    </form>
                </div>
                <div className="review-item py-4 bg-black bg-opacity-20 rounded-lg shadow-md px-6 w-full sm:w-auto">
                    <p className="text-white mb-2">You can contact using below details:</p>
                    <p className="text-white mb-2 flex"><MdEmail className='w-6 h-6' /> traveldiaries@gmail.com</p>
                    <p className="text-white mb-2 flex"><MdPhone className='w-6 h-6' /> +91-0000000000</p>
                    <p className="text-white mb-2">Address: xyz building, abc, Maharashtra</p>
                </div>
            </div>

        </section>
    )
}

export default Contact