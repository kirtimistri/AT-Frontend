import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage2 from './components/Pages/LoginPage2'
import SearchPage from './components/Pages/SearchPage'
// import LoginPage from './components/LoginPage'
// import LoginPage3 from './components/LoginPage3'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage2 />} />
        <Route path="/search" element={<SearchPage />} />
        {/* <Route path="/login1" element={<LoginPage />} /> */}
        {/* <Route path="/login3" element={<LoginPage3 />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App