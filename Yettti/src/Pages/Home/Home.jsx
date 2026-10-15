import React from 'react'
import Layout from '../../Components/Layout/Layout'
import Hero from '../../Components/Hero/Hero'
import DonationView from '../../Components/DonationView/DonationView'
import Partners from '../../Components/Partners/Partners'
import Family from '../../Components/Family/Family'
import Friends from '../../Components/Friends/Friends'
import Announcements from '../../Components/Announcements/Announcements'

function Home() {
  return (
    <>
     <Layout/>
     <Hero/>
     <DonationView/>
     <Partners/>
     <Family/>
     <Friends/>
     <Announcements/>
    </>
  )
}

export default Home