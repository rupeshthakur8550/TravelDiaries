import React from 'react';
import Banner from '../Home/Banner';
import Commitments from '../Home/Commitments';
import About from '../Home/About'
import Season from '../Home/Season';
import Footer from '../footer/Footer';

function Home() {
  return (
    <>
      <Banner/>
      <Commitments/>
      <Season/>
      <About/>
      <Footer/>
    </>
  );
}

export default Home;
