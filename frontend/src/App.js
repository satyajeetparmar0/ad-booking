import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import FloatingContact from '@/components/FloatingContact';
import Home from '@/pages/Home';
import BookNow from '@/pages/BookNow';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import AdListing from '@/pages/AdListing';
import AdDetails from '@/pages/AdDetails';
import ClientDashboard from '@/pages/ClientDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import '@/App.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <FloatingContact />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/book-now" element={<BookNow />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ads" element={<AdListing />} />
            <Route path="/ads/:id" element={<AdDetails />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <ClientDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
      </div>
    </AuthProvider>
  );
}

export default App;
