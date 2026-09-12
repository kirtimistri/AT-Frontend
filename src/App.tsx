// Top-level component: sets up all the app routes (pages) and navigation.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage2 from './Pages/LoginPage2'
import RegisterPage from './Pages/RegisterPage'
import SearchPage from './Pages/SearchPage'
import ReviewPage from './Pages/ReviewPage'
import TripReviewPage from './Pages/TripReviewPage'
import { ToastViewport } from './components/Toast'
import { PageTransitionController } from './components/AkbarBizvoyPageLoader'
import { AkbarBizvoyLoader } from './components/AkbarBizvoyLoader'
import './theme.css' // Light theme styles
// import LoginPage from './components/LoginPage'
// import LoginPage3 from './components/LoginPage3'

function App() {
  return (
    // BrowserRouter enables navigation between pages using the browser URL.
    <BrowserRouter>
      {/* Drives the global loader for SPA page transitions. */}
      <PageTransitionController />

      {/* The ONE global branded loader. Everything else calls the store. */}
      <AkbarBizvoyLoader />

      {/* Overlay where toast messages (notifications) appear. */}
      <ToastViewport />
      {/* Routes: each <Route> maps a URL path to the page component to show. */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage2 />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchPage />} />
<Route path="/review" element={<ReviewPage />} />
        <Route path="/review-trip" element={<TripReviewPage />} />
        {/* <Route path="/login1" element={<LoginPage />} /> */}
        {/* <Route path="/login3" element={<LoginPage3 />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App