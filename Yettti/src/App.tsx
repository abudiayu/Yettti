import { Routes, Route, } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home/Home.jsx'
import NotFound from './Pages/NotFound/NotFound.jsx'
import Auth from "./Pages/Auth/Auth.jsx"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Any unknown URL goes back to Home */}
      <Route path="*" element={<NotFound />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App