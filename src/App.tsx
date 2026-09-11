// Top-level component: sets up all the app routes (pages) and navigation.
import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastViewport } from './components/Toast'
import {
  AkbarBizvoyPageLoader,
  PageTransitionController,
} from './components/AkbarBizvoyPageLoader'
import { FlightLoader } from './components/FlightLoader'
import { useThemeStore } from './store/themeStore'
import './theme.css' // Light theme styles

// Route-level code splitting: each page chunk loads on first visit only.
const LoginPage2 = lazy(() => import('./Pages/LoginPage2'))
const RegisterPage = lazy(() => import('./Pages/RegisterPage'))
const SearchPage = lazy(() => import('./Pages/SearchPage'))
const ReviewPage = lazy(() => import('./Pages/ReviewPage'))
const TripReviewPage = lazy(() => import('./Pages/TripReviewPage'))
// import LoginPage from './components/LoginPage'
// import LoginPage3 from './components/LoginPage3'

// Branded placeholder shown while a page chunk is being fetched. Once the
// route mounts, the global loader takes over for any SPA page transitions.
const PageSuspenseFallback = () => {
  const { theme } = useThemeStore();
  const isLight = theme === 'light';

  return (
    <div
      className={`flex min-h-screen items-center justify-center ${isLight ? 'bg-[#FAF8F7]' : 'bg-[#0B132B]'}`}
    >
      <FlightLoader
        isLoading
        primary="LIMA"
        accent="OSCAR"
        secondary="ALPHA DELTA INDIA NOVEMBER GOLF…"
      />
    </div>
  );
};

function App() {
  return (
    // BrowserRouter enables navigation between pages using the browser URL.
    <BrowserRouter>
      {/* Drives the global loader for SPA page transitions. */}
      <PageTransitionController />

      {/* The ONE global branded loader. Everything else calls the store. */}
      <AkbarBizvoyPageLoader />

      {/* Overlay where toast messages (notifications) appear. */}
      <ToastViewport />

      {/* Suspense wraps the lazy pages so a chunk-loading fallback shows
          while the code for the requested route is being fetched. */}
      <Suspense fallback={<PageSuspenseFallback />}>
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
      </Suspense>
    </BrowserRouter>
  )
}

export default App