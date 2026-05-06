// import { useState } from 'react'
import { Route , Routes } from 'react-router-dom'
import { Header } from './components/header/header.tsx'

import { Workpage  } from './pages/workpage/workpage.tsx'
import { Infopage } from './pages/infopage/infopage.tsx'
import { Storypage } from './pages/storypage/storypage.tsx'

import { Toaster, toast } from 'sonner';


function App() {
  return (
    <>
      <Header firstLink = "/info" secondLink = "/work" thirdLink = "/story" /> 

      <Routes>
        <Route path='/info'  element={<Infopage/>} />
        <Route path='/work'  element={<Workpage />} />
        <Route path='/story'  element={<Storypage />} />
      </Routes>

       <Toaster />
    </>
  )
}

export default App
