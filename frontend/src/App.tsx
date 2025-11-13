import { Routes, Route } from 'react-router-dom'
import Auth from "./pages/Auth"
import Whiteboard from "./pages/Whiteboard"
import { AuthCallback } from './utils/AuthCallback'



function App() {
  return (
    <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
        <Route path="/auth/callback" element={<AuthCallback />} />        
      </Routes>
  )
}

export default App
