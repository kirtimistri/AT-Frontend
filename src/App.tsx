import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage2 from './Pages/LoginPage2'
import RegisterPage from './Pages/RegisterPage'
import SearchPage from './Pages/SearchPage'
import TripReviewPage from './Pages/TripReviewPage'
import ReviewPage from './Pages/ReviewPage'
import { ThemeToggle } from './components/ThemeToggle'
import './theme.css'

function App() {
  return (
    <BrowserRouter>
      <ThemeToggle />

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage2 />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/review-trip" element={<TripReviewPage />} />
        <Route path="/review" element={<ReviewPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App