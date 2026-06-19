import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProtectedRoute from './components/ProtectedRoute';
import Preloader from './components/Preloader';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Code-split the non-landing routes for faster first load.
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

const RouteFallback = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="font-orbitron uppercase tracking-widest gradient-text animate-pulse">Loading…</div>
    </div>
);

function App() {
    const [loading, setLoading] = React.useState(true);

    return (
        <ThemeProvider>
            <AuthProvider>
                {loading && <Preloader setLoading={setLoading} />}
                <Router>
                    <div className={`min-h-screen bg-primary transition-opacity duration-1000 ${loading ? 'opacity-0' : 'opacity-100'}`}>
                        <Navbar />
                        <Suspense fallback={<RouteFallback />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/about-me" element={<AboutPage />} />
                                <Route path="/project/:id" element={<ProjectDetail />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <Dashboard />
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
                        </Suspense>
                    </div>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
