import React from 'react'
import Header from '../components/Header'
import SocialityMenu from '../components/SocialityMenu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
const Home = () => {
  return (
    <div> 
        <Header/>
        <SocialityMenu/>
        <TopDoctors/>
        <Banner/>
        {/* <Footer/> */}
    </div>
  )
}

export default Home