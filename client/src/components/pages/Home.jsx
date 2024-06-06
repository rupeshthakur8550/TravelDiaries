import React from 'react';
import Banner from '../Home/Banner';
import Commitments from '../Home/Commitments';
import About from '../Home/About'
import Season from '../Home/Season';
import Footer from './Footer';
import Contact from '../Home/Contact';

function Home() {
  return (
    <>
      <Banner />
      <Commitments />
      <About />
      <Season />
      <Contact />
      <Footer />
    </>
  );
}

export default Home;
