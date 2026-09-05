import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage2 from './Pages/LoginPage2'
import SearchPage from './Pages/SearchPage'
import { ToastViewport } from './components/Toast'
// import LoginPage from './components/LoginPage'
// import LoginPage3 from './components/LoginPage3'

function App() {
  return (
    <BrowserRouter>
      <ToastViewport />
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