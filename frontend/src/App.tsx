import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { MobileNavbar } from './components/MobileNavbar';
import { HomePage } from './pages/HomePage';
import { JournalPage } from './pages/JournalPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RegisterSuccessPage } from './pages/RegisterSuccessPage';

const queryClient = new QueryClient();

// The old app's login/register templates only ever included the mobile nav,
// never the desktop navbar (which assumes it's the only chrome on the page) —
// login/register's own layout is `position: absolute; height: 100vh` and was
// never designed to sit below a navbar. Match that per-page behavior here.
const PAGES_WITH_DESKTOP_NAVBAR = ['/', '/journal'];

function Chrome() {
  const location = useLocation();
  const showDesktopNavbar = PAGES_WITH_DESKTOP_NAVBAR.includes(location.pathname);

  return (
    <>
      <MobileNavbar />
      {showDesktopNavbar && <Navbar />}
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Chrome />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/register/success" element={<RegisterSuccessPage />} />
            <Route
              path="/journal"
              element={
                <ProtectedRoute>
                  <JournalPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
