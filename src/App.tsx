// import { useState } from 'react'
import { Route , Routes } from 'react-router-dom'

import { Workpage  } from './pages/workpage/workpage.tsx'

function App() {
  return (
    <>
      <Routes>
        <Route path='/work'  element = {Workpage('john237')} />
      </Routes>
    </>
  )
}

export default App
