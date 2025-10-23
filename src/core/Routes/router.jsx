import { Route, Routes } from 'react-router-dom'
import About from '../../pages/About'
import Home from '../../pages/Home'

export function AppRoutesUser() {
  return (
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/" element={<Home />} />
    </Routes>
  )
}







