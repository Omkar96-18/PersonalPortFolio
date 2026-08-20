import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AntigravityBackground from './components/AntigravityBackground';
import CustomCursor from './components/CustomCursor';
import UniverseLanding from './components/UniverseLanding';

function SmoothScrollManager() {
  const location = useLocation();

  useEffect(() => {
    // Initialize Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential deceleration
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      infinite: false,
    });

    window.lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  // Handle route change scrolling seamlessly with element retry
  useEffect(() => {
    if (location.hash) {
      const scrollWithRetry = (attempts = 0) => {
        const target = document.querySelector(location.hash);
        if (target) {
          if (window.lenis) {
            window.lenis.scrollTo(target, { offset: -70, duration: 1.1 });
          } else {
            const yOffset = -70;
            const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        } else if (attempts < 8) {
          setTimeout(() => scrollWithRetry(attempts + 1), 80);
        }
      };
      scrollWithRetry();
    } else {
      window.lenis?.scrollTo(0, { immediate: true });
    }
  }, [location]);

  return null;
}

function App() {
  // Show landing intro once per page session, re-enabling when user reloads the browser
  const [showIntro, setShowIntro] = useState(true);

  const handleEnterSystem = () => {
    setShowIntro(false);
  };

  const baseName = import.meta.env.BASE_URL || '/';

  return (
    <Router basename={baseName}>
      <SmoothScrollManager />
      <CustomCursor />
      {showIntro && <UniverseLanding onEnter={handleEnterSystem} />}
      <Navbar />
      <AntigravityBackground 
        count={610}
        magnetRadius={10}
        ringRadius={18}
        waveSpeed={0.9}
        waveAmplitude={1}
        particleSize={1.5}
        lerpSpeed={0.17}
        color="#ff8282"
        autoAnimate
        particleVariance={1.9}
        rotationSpeed={0.3}
        depthFactor={2.6}
        pulseSpeed={4.5}
        particleShape="capsule"
        fieldStrength={6}
      />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/PersonalPortFolio" element={<Home />} />
          <Route path="/PersonalPortfolio" element={<Home />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
