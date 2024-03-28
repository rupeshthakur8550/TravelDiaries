import React from 'react'
import Footer from '../footer/Footer'
import Banner from '../Home/Banner'
import Benefit from '../Home/Benefits'
import Services from '../Home/Services'

function Home() {
  return (
    <>
      <div className='min-h-screen'>
      <Banner/>
      <Benefit/>
      <Services/>
      </div>
      <footer><Footer/></footer>
    </>

  )
}

export default Home