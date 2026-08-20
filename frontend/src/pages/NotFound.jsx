import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rocket, Compass, ArrowLeft, Radio, Disc, Sparkles, RefreshCw, AlertTriangle } from 'lucide-react';

export const NotFound = () => {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [coordinates, setCoordinates] = useState({ ra: '18h 36m 56s', dec: '+38° 47′ 01″' });
  const [warpActive, setWarpActive] = useState(false);
  const [warpCountdown, setWarpCountdown] = useState(null);

  // Canvas starfield, orbiting asteroid belt & interactive black hole / gravitational lens
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: width / 2, y: height / 2, active: false };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = width / 2;
      mouse.y = height / 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Deep Space Stars
    const starCount = Math.min(180, Math.floor((width * height) / 8000));
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.6 + 0.4,
      baseAlpha: Math.random() * 0.7 + 0.3,
      twinkleSpeed: Math.random() * 0.03 + 0.008,
      phase: Math.random() * Math.PI * 2,
      color: Math.random() > 0.8 ? '#F62440' : Math.random() > 0.6 ? '#94A3B8' : '#FFFFFF',
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
    }));

    // Floating Stardust / Space Dust Particles
    const dustCount = 40;
    const dustParticles = Array.from({ length: dustCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    // Floating Cosmic Satellite / Astronaut Orb
    const satellite = {
      x: width * 0.75,
      y: height * 0.3,
      vx: 0.25,
      vy: -0.15,
      angle: 0,
      rotationSpeed: 0.006,
      size: 18,
    };

    // Shooting Stars / Meteors
    const meteors = [];
    const createMeteor = () => {
      if (Math.random() > 0.02 || meteors.length > 2) return;
      meteors.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * height * 0.4,
        length: Math.random() * 80 + 50,
        speed: Math.random() * 10 + 8,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 1,
        life: 1,
      });
    };

    let tick = 0;

    const animate = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      const isLight = document.body.classList.contains('light-theme');

      // 1. Draw Starfield
      stars.forEach((star) => {
        star.phase += star.twinkleSpeed;
        const currentAlpha = star.baseAlpha + Math.sin(star.phase) * 0.3;

        // Gentle drift
        star.x += star.speedX;
        star.y += star.speedY;

        // Wrap around borders
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha * (isLight ? 0.4 : 1)));
        ctx.fill();
      });

      // 2. Draw Dust Nebula Layers
      dustParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? 'rgba(246, 36, 64, 0.2)' : 'rgba(246, 36, 64, 0.35)';
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      // 3. Draw Meteors
      createMeteor();
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.opacity -= 0.018;

        if (m.opacity <= 0) {
          meteors.splice(i, 1);
          continue;
        }

        const tailX = m.x - Math.cos(m.angle) * m.length;
        const tailY = m.y - Math.sin(m.angle) * m.length;

        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(246, 36, 64, 0)');
        grad.addColorStop(0.7, 'rgba(246, 36, 64, 0.5)');
        grad.addColorStop(1, '#FFFFFF');

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.globalAlpha = m.opacity;
        ctx.stroke();
      }

      // 4. Draw Floating Satellite / Cyber Probe
      satellite.x += satellite.vx;
      satellite.y += satellite.vy;
      satellite.angle += satellite.rotationSpeed;

      if (satellite.x > width + 50) satellite.x = -50;
      if (satellite.y < -50) satellite.y = height + 50;

      ctx.save();
      ctx.translate(satellite.x, satellite.y);
      ctx.rotate(satellite.angle);
      ctx.globalAlpha = isLight ? 0.6 : 0.85;

      // Solar Panel Wings
      ctx.fillStyle = '#1E293B';
      ctx.strokeStyle = 'rgba(246, 36, 64, 0.6)';
      ctx.lineWidth = 1;
      ctx.fillRect(-22, -4, 12, 8);
      ctx.strokeRect(-22, -4, 12, 8);
      ctx.fillRect(10, -4, 12, 8);
      ctx.strokeRect(10, -4, 12, 8);

      // Core Module
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
      ctx.strokeStyle = '#F62440';
      ctx.stroke();

      // Flashing Beacon
      const beaconAlpha = 0.5 + Math.sin(tick * 0.1) * 0.5;
      ctx.beginPath();
      ctx.arc(0, -9, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(246, 36, 64, ${beaconAlpha})`;
      ctx.fill();

      ctx.restore();

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Initiate Warp Jump back to base / Home
  const handleInitiateWarp = () => {
    setWarpActive(true);
    setWarpCountdown(3);

    const interval = setInterval(() => {
      setWarpCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={`notfound-viewport ${warpActive ? 'warp-engaged' : ''}`}>
      {/* Background Outer Space Canvas */}
      <canvas ref={canvasRef} className="space-canvas" />

      {/* Deep Space Ambient Glow Halos */}
      <div className="space-glow-orb space-glow-primary" />
      <div className="space-glow-orb space-glow-secondary" />

      <div className="container notfound-container">
        {/* Telemetry Status Strip */}
        <div className="telemetry-badge-strip">
          <span className="telemetry-status-pill">
            <span className="anomaly-dot" /> ANOMALY DETECTED // SECTOR 404
          </span>
          <span className="telemetry-coord-text">
            <Radio size={12} className="accent-red-icon" /> RA: {coordinates.ra} | DEC: {coordinates.dec}
          </span>
        </div>

        {/* Massive Holographic 404 Hero Display */}
        <div className="hologram-404-wrapper">
          <div className="hologram-number-glow">404</div>
          <div className="hologram-number-main">404</div>
          <div className="hologram-orbit-ring ring-1" />
          <div className="hologram-orbit-ring ring-2" />
          <div className="orbiting-planetoid" />
        </div>

        {/* Content & Narrative */}
        <div className="notfound-content">
          <h1 className="notfound-headline">LOST IN DEEP SPACE</h1>
          <p className="notfound-description">
            You have drifted beyond the charted boundaries of this technical portfolio. The celestial coordinates
            you requested do not exist in this sector or have collapsed into a gravitational singularity.
          </p>

          {/* Telemetry Diagnostics Box */}
          <div className="glass-panel telemetry-diag-box">
            <div className="diag-header">
              <span className="diag-header-dot" />
              <span>ORBITAL FLIGHT RECORDER &amp; DIAGNOSTICS</span>
            </div>
            <div className="diag-grid">
              <div className="diag-item">
                <span className="diag-label">CARRIER FREQUENCY</span>
                <span className="diag-value">1420.405 MHz (NO SIGNAL)</span>
              </div>
              <div className="diag-item">
                <span className="diag-label">TRAJECTORY DRIFT</span>
                <span className="diag-value">+99.98% OUT OF BOUNDS</span>
              </div>
              <div className="diag-item">
                <span className="diag-label">HULL INTEGRITY</span>
                <span className="diag-value">100% NOMINAL</span>
              </div>
              <div className="diag-item">
                <span className="diag-label">NAVIGATION BEACON</span>
                <span className="diag-value highlight-red">devil37 // PORTFOLIO ORBIT</span>
              </div>
            </div>
          </div>

          {/* Action Controls */}
          <div className="notfound-actions">
            <Link to="/" className="btn btn-primary warp-button">
              <Rocket size={16} /> Return to Orbit (Home)
            </Link>

            <Link to="/blogs" className="btn btn-secondary explore-button">
              <Compass size={16} /> Technical Blog
            </Link>

            <button 
              type="button" 
              onClick={handleInitiateWarp} 
              disabled={warpActive}
              className="btn btn-secondary warp-drive-trigger"
              title="Initiate emergency automated warp jump to home station"
            >
              {warpActive ? (
                <>
                  <RefreshCw size={15} className="spin-icon" /> Jump in {warpCountdown}s...
                </>
              ) : (
                <>
                  <Sparkles size={15} className="accent-red-icon" /> Emergency Warp Jump
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .notfound-viewport {
          min-height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 120px 20px 80px 20px;
          overflow: hidden;
          background: #000000;
        }

        .space-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .space-glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }
        .space-glow-primary {
          top: 15%;
          left: 50%;
          transform: translateX(-50%);
          width: 600px;
          height: 350px;
          background: radial-gradient(circle, rgba(246, 36, 64, 0.18) 0%, rgba(128, 10, 28, 0.05) 60%, transparent 80%);
        }
        .space-glow-secondary {
          bottom: 10%;
          right: 15%;
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(128, 10, 28, 0.15) 0%, transparent 70%);
        }

        .notfound-container {
          position: relative;
          z-index: 10;
          max-width: 820px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Telemetry Badge Strip */
        .telemetry-badge-strip {
          display: inline-flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
          margin-bottom: 24px;
        }
        .telemetry-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 16px;
          border-radius: 999px;
          background: rgba(246, 36, 64, 0.15);
          border: 1px solid rgba(246, 36, 64, 0.4);
          color: var(--accent-red);
          font-family: var(--font-mono);
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 1.5px;
        }
        .anomaly-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #F62440;
          box-shadow: 0 0 8px #F62440;
          animation: pulseAnomaly 1.5s infinite ease-in-out;
        }
        @keyframes pulseAnomaly {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }

        .telemetry-coord-text {
          font-family: var(--font-mono);
          font-size: 0.75rem;
          color: var(--text-secondary);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          letter-spacing: 0.5px;
        }

        /* Holographic 404 Graphic */
        .hologram-404-wrapper {
          position: relative;
          width: 320px;
          height: 180px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        .hologram-number-main {
          font-family: var(--font-sans);
          font-size: 8.5rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -6px;
          color: #FFFFFF;
          background: linear-gradient(180deg, #FFFFFF 30%, rgba(246, 36, 64, 0.8) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 30px rgba(246, 36, 64, 0.4));
          position: relative;
          z-index: 2;
          user-select: none;
        }
        .hologram-number-glow {
          position: absolute;
          font-family: var(--font-sans);
          font-size: 8.5rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -6px;
          color: rgba(246, 36, 64, 0.4);
          filter: blur(16px);
          z-index: 1;
          user-select: none;
        }

        .hologram-orbit-ring {
          position: absolute;
          border-radius: 50%;
          border: 1px dashed rgba(246, 36, 64, 0.35);
          pointer-events: none;
        }
        .ring-1 {
          width: 290px;
          height: 110px;
          transform: rotate(-18deg);
          animation: orbitRotate 18s linear infinite;
        }
        .ring-2 {
          width: 330px;
          height: 130px;
          transform: rotate(24deg);
          border-color: rgba(255, 255, 255, 0.15);
          animation: orbitRotateRev 24s linear infinite;
        }
        @keyframes orbitRotate {
          from { transform: rotate(-18deg) rotate(0deg); }
          to { transform: rotate(-18deg) rotate(360deg); }
        }
        @keyframes orbitRotateRev {
          from { transform: rotate(24deg) rotate(0deg); }
          to { transform: rotate(24deg) rotate(-360deg); }
        }

        .orbiting-planetoid {
          position: absolute;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #F62440;
          box-shadow: 0 0 12px #F62440;
          top: 30px;
          right: 25px;
          animation: floatPlanetoid 4s ease-in-out infinite alternate;
        }
        @keyframes floatPlanetoid {
          0% { transform: translate(0, 0) scale(0.9); }
          100% { transform: translate(-14px, 16px) scale(1.15); }
        }

        /* Headline & Descriptions */
        .notfound-headline {
          font-family: var(--font-sans);
          font-size: 2.2rem;
          font-weight: 800;
          letter-spacing: -1px;
          color: #FFFFFF;
          margin-bottom: 14px;
        }
        .notfound-description {
          font-size: 0.98rem;
          line-height: 1.7;
          color: var(--text-secondary);
          max-width: 620px;
          margin: 0 auto 28px auto;
        }

        /* Telemetry Diagnostics Box */
        .telemetry-diag-box {
          width: 100%;
          max-width: 660px;
          padding: 20px 24px;
          border-radius: var(--border-radius-md);
          background: rgba(10, 10, 15, 0.75);
          border: 1px solid rgba(246, 36, 64, 0.25);
          box-shadow: 0 15px 35px -10px rgba(0,0,0,0.85);
          margin-bottom: 34px;
          text-align: left;
        }
        .diag-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--text-secondary);
          letter-spacing: 1.5px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .diag-header-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent-red);
          box-shadow: 0 0 6px var(--accent-red);
        }
        .diag-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 12px 20px;
        }
        .diag-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .diag-label {
          font-family: var(--font-mono);
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.8px;
        }
        .diag-value {
          font-family: var(--font-mono);
          font-size: 0.82rem;
          color: #FFFFFF;
          font-weight: 600;
        }
        .highlight-red {
          color: var(--accent-red);
        }

        /* Action Buttons */
        .notfound-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .warp-button {
          background: linear-gradient(135deg, var(--accent-red) 0%, var(--accent-dark-red) 100%) !important;
          border-color: var(--accent-red) !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 20px var(--accent-red-glow);
          font-weight: 700;
          padding: 12px 24px;
          font-size: 0.9rem;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .warp-button:hover {
          box-shadow: 0 0 30px var(--accent-red) !important;
          transform: translateY(-2px);
        }
        .explore-button, .warp-drive-trigger {
          padding: 12px 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .warp-drive-trigger {
          cursor: pointer;
        }

        /* Warp Jump Active Animation */
        .notfound-viewport.warp-engaged {
          animation: warpScreenShake 0.4s ease infinite;
        }
        @keyframes warpScreenShake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(-2px, 2px); }
          50% { transform: translate(2px, -1px); }
          75% { transform: translate(-1px, -2px); }
          100% { transform: translate(1px, 1px); }
        }

        /* Light Theme Overrides */
        body.light-theme .notfound-viewport {
          background: #FAFAFC;
        }
        body.light-theme .hologram-number-main {
          background: linear-gradient(180deg, #0F172A 30%, #F62440 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        body.light-theme .notfound-headline {
          color: #0F172A;
        }
        body.light-theme .notfound-description {
          color: #475569;
        }
        body.light-theme .telemetry-diag-box {
          background: #FFFFFF;
          border-color: rgba(246, 36, 64, 0.2);
          box-shadow: 0 15px 35px -10px rgba(15, 23, 42, 0.1);
        }
        body.light-theme .diag-value {
          color: #0F172A;
        }

        @media (max-width: 600px) {
          .hologram-404-wrapper { width: 240px; height: 140px; }
          .hologram-number-main, .hologram-number-glow { font-size: 6rem; }
          .notfound-headline { font-size: 1.7rem; }
          .notfound-actions { flex-direction: column; width: 100%; }
          .warp-button, .explore-button, .warp-drive-trigger { width: 100%; justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default NotFound;
