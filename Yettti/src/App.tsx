import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home.jsx'
import NotFound from './Pages/NotFound/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Any unknown URL goes back to Home */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App