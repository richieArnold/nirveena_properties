import React from 'react'
import Hero from '../components/Home/Hero'
import PropertyTabs from '../components/Home/PropertyTabs'
import Contact from '../components/Home/Contact'
import Testimonial from '../components/Home/Testimonial'
import Stats from '../components/Home/Stats'
import Amenities from '../components/Home/Amenities'

const Home = () => {
  return (
    <div>
      <Hero/>
      <PropertyTabs/>
      <Amenities/>
      <Testimonial/>
      <Stats/>
      <Contact/>

    </div>
  )
}

export default Home
