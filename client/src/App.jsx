import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import WhatsAppButton from './components/WhatsAppButton';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
import { AuthProvider } from './context/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = React.useState(true);

  return (
    <AuthProvider>
      {loading && <Preloader setLoading={setLoading} />}
      <Router>
        <div className={`min-h-screen bg-primary transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <WhatsAppButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
