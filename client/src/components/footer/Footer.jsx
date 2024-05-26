import React from 'react';
import { Link } from 'react-router-dom';
import { Footer } from 'flowbite-react'
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';
import Logo from '../../assets/images/Logo.svg'

const FooterS = () => {

    return (
        <Footer container className='border border-t-8 border-yellow-300 bg-gray-900'>
            <div className='w-full mx-auto text-white'>
                <div className='grid w-full justify-between items-center sm:flex md:grid-cols-1'>
                    <div className='my-5'>
                        <Link to="/" className="flex items-center">
                            <img
                                src={Logo}
                                className='mb-4 h-36 mix-blend-difference ml-[5vw] md:ml-0'
                                alt="Logo"
                            />
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8 mt-4 sm:grid-cols-4 sm:gap-6'>
                        <div>
                            <Footer.Title className='text-gray-200 text-lg font-semibold' style={{ fontVariant: 'unicase' }} title='About' />
                            <Footer.LinkGroup col>
                                <Footer.Link className='hover:text-gray-300' href='/about'>About</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title className='text-gray-200 text-lg font-semibold' style={{ fontVariant: 'unicase' }} title='Contact Us' />
                            <Footer.LinkGroup col>
                                <Footer.Link className='hover:text-gray-300' href='#'>Email : info@traveldiaries.com</Footer.Link>
                                <Footer.Link className='hover:text-gray-300' href='#'>Phone : +91-0000000000</Footer.Link>
                                <Footer.Link className='hover:text-gray-300' href='#'>Address : 123 Main Street, City, Country.</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title className='text-gray-200 text-lg font-semibold' style={{ fontVariant: 'unicase' }} title='Follow Us' />
                            <Footer.LinkGroup col>
                                <Footer.Link className='hover:text-gray-300' href='#'>Facebook</Footer.Link>
                                <Footer.Link className='hover:text-gray-300' href='#'>Twitter</Footer.Link>
                                <Footer.Link className='hover:text-gray-300' href='#'>Instagram</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title className='text-gray-200 text-lg font-semibold' style={{ fontVariant: 'unicase' }} title='FAQs' />
                            <Footer.LinkGroup col>
                                <Footer.Link className='hover:text-gray-300' href='#'>FAQs</Footer.Link>
                                <Footer.Link className='hover:text-gray-300' href='#'>Help Center</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title className='text-gray-200 text-lg font-semibold' style={{ fontVariant: 'unicase' }} title='Blog' />
                            <Footer.LinkGroup col>
                                <Footer.Link className='hover:text-gray-300' href='#'>Latest Articles</Footer.Link>
                                <Footer.Link className='hover:text-gray-300' href='#'>Variety</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title className='text-gray-200 text-lg font-semibold' style={{ fontVariant: 'unicase' }} title='Careers' />
                            <Footer.LinkGroup col>
                                <Footer.Link className='hover:text-gray-300' href='#'>Job Opportunities</Footer.Link>
                                <Footer.Link className='hover:text-gray-300' href='#'>Internships</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title className='text-gray-200 text-lg font-semibold' style={{ fontVariant: 'unicase' }} title='Terms of Services' />
                            <Footer.LinkGroup col>
                                <Footer.Link className='hover:text-gray-300' href='#'>Privacy Policy</Footer.Link>
                                <Footer.Link className='hover:text-gray-300' href='#'>Terms &amp; Conditions</Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className='w-full sm:flex text-center sm:justify-between'>
                    <Footer.Copyright
                        className='hover:text-gray-300'
                        href='#'
                        by="Travel Diaries"
                        year={new Date().getFullYear()}
                    />
                    <div className="flex gap-6 sm:mt-0 mt-4 justify-center">
                        <Footer.Icon className='hover:text-gray-300' href='#' icon={BsFacebook} />
                        <Footer.Icon className='hover:text-gray-300' href='#' icon={BsInstagram} />
                        <Footer.Icon className='hover:text-gray-300' href='#' icon={BsTwitter} />
                        <Footer.Icon className='hover:text-gray-300' href='https://github.com/rupeshthakur8550' icon={BsGithub} />
                        <Footer.Icon className='hover:text-gray-300' href='#' icon={BsDribbble} />
                    </div>
                </div>
            </div>
        </Footer>
    );
}

export default FooterS;
