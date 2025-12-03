import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LawCentralApp from './LawCentralApp'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/*" element={<LawCentralApp />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
