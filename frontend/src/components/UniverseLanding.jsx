import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const UniverseLanding = ({ onEnter }) => {
  const containerRef   = useRef(null);
  const canvasRef      = useRef(null);
  const titleRef       = useRef(null);
  const subtitleRef    = useRef(null);
  const progressRef    = useRef(null);
  const progressBarRef = useRef(null);
  const buttonRef      = useRef(null);

  const [percent, setPercent]   = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredPlanetData, setHoveredPlanetData] = useState(null);
  const zoomProgressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: null, y: null };
    const handleMouseMove  = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseLeave = () => { mouse.x = null; mouse.y = null; };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    /* ── Starfield background ── */
    const starsBack = Array.from({ length: 260 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      size: Math.random() * 0.8 + 0.2, phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.008 + 0.003
    }));
    const starsMid = Array.from({ length: 100 }, () => ({
      x: Math.random() * width, y: Math.random() * height,
      size: Math.random() * 1.3 + 0.4, phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.02 + 0.008,
      color: Math.random() > 0.85 ? '#FFE082' : '#FFFFFF'
    }));

    /* ── PLANET DEFINITIONS ── */
    const planets = [
      {
        name: 'MERCURY', distance: 68, radius: 3.4, speed: 0.0048,
        angle: Math.random() * Math.PI * 2, au: '0.39 AU (57.9M km)',
        diameter: '4,879 km', mass: '3.30 × 10²³ kg', period: '87.97 days', temp: '-180°C to 430°C', moons: '0',
        gravity: '3.70 m/s² (0.38g)', orbSpeed: '47.36 km/s', escapeVel: '4.25 km/s',
        pressure: '10⁻¹⁴ bar', core: 'Metallic Iron-Nickel (85% radius)',
        composition: '70% Metallic / 30% Silicate',
        feature: 'Caloris Basin impact crater (1,550 km wide)',
        gradient: [['#A69688', 0], ['#7A6C60', 0.5], ['#4D4239', 1]],
        currentScale: 1.0,
      },
      {
        name: 'VENUS', distance: 102, radius: 5.8, speed: 0.0048,
        angle: Math.random() * Math.PI * 2, au: '0.72 AU (108.2M km)',
        diameter: '12,104 km', mass: '4.87 × 10²⁴ kg', period: '224.7 days', temp: '465°C (Hottest Planet)', moons: '0',
        gravity: '8.87 m/s² (0.90g)', orbSpeed: '35.02 km/s', escapeVel: '10.36 km/s',
        pressure: '92.0 bar (92x Earth pressure)', core: 'Central Iron Core & Rocky Mantle',
        composition: '96.5% CO₂ / 3.5% N₂ Cloud Deck',
        feature: 'Runaway greenhouse thermal trap & sulfuric rain',
        gradient: [['#F5D076', 0], ['#D4A038', 0.4], ['#996E1D', 1]],
        atmosphere: 'rgba(240, 190, 70, 0.25)',
        atmosphereSize: 1.35,
        currentScale: 1.0,
      },
      {
        name: 'EARTH', distance: 140, radius: 6.2, speed: 0.0048,
        angle: Math.random() * Math.PI * 2, au: '1.00 AU (149.6M km)',
        diameter: '12,742 km', mass: '5.97 × 10²⁴ kg', period: '365.25 days', temp: '15°C (Standard)', moons: '1 (Luna)',
        gravity: '9.81 m/s² (1.00g)', orbSpeed: '29.78 km/s', escapeVel: '11.19 km/s',
        pressure: '1.013 bar (1 atm)', core: 'Solid Iron Inner / Liquid Outer Core',
        composition: '78.1% N₂ / 20.9% O₂ / Liquid Oceans',
        feature: 'Only body known to harbor active biological life',
        gradient: [['#4DA6E8', 0], ['#2F7BC0', 0.3], ['#1A5C9A', 0.7], ['#2E8B4A', 1]],
        atmosphere: 'rgba(100, 180, 255, 0.25)',
        atmosphereSize: 1.28,
        hasMoon: true,
        moonAngle: Math.random() * Math.PI * 2,
        currentScale: 1.0,
      },
      {
        name: 'MARS', distance: 182, radius: 4.6, speed: 0.0048,
        angle: Math.random() * Math.PI * 2, au: '1.52 AU (227.9M km)',
        diameter: '6,779 km', mass: '6.42 × 10²³ kg', period: '686.98 days', temp: '-65°C avg', moons: '2 (Phobos, Deimos)',
        gravity: '3.72 m/s² (0.38g)', orbSpeed: '24.07 km/s', escapeVel: '5.03 km/s',
        pressure: '0.006 bar (0.6% Earth atm)', core: 'Fe-S Core / Basaltic Crust',
        composition: '95.3% CO₂ / Iron Oxide (Dust)',
        feature: 'Olympus Mons volcano (21.9 km high, 2.5x Everest)',
        gradient: [['#E05638', 0], ['#B83C20', 0.5], ['#7A200B', 1]],
        atmosphere: 'rgba(220, 90, 40, 0.18)',
        atmosphereSize: 1.22,
        currentScale: 1.0,
      },
      {
        name: 'JUPITER', distance: 245, radius: 13.5, speed: 0.0048,
        angle: Math.random() * Math.PI * 2, au: '5.20 AU (778.5M km)',
        diameter: '139,820 km', mass: '1.90 × 10²⁷ kg (317.8× Earth)', period: '11.86 years', temp: '-110°C cloud tops', moons: '95 (Io, Europa...)',
        gravity: '24.79 m/s² (2.53g)', orbSpeed: '13.07 km/s', escapeVel: '59.50 km/s',
        pressure: '2,000+ bar', core: 'Dense Rocky Core / Metallic H₂',
        composition: '89.8% H₂ / 10.2% He Gas Giant',
        feature: 'Great Red Spot anticyclonic storm (350+ yrs active)',
        gradient: [['#D4AB79', 0], ['#B88344', 0.35], ['#8C5D27', 0.7], ['#D4AB79', 1]],
        atmosphere: 'rgba(210, 160, 90, 0.18)',
        atmosphereSize: 1.16,
        hasBands: true,
        bandColors: ['rgba(120,80,40,0.5)', 'rgba(190,130,70,0.4)', 'rgba(80,50,20,0.45)', 'rgba(160,110,60,0.35)'],
        hasGreatSpot: true,
        currentScale: 1.0,
      },
      {
        name: 'SATURN', distance: 310, radius: 11.0, speed: 0.0048,
        angle: Math.random() * Math.PI * 2, au: '9.58 AU (1.43B km)',
        diameter: '116,460 km', mass: '5.68 × 10²⁶ kg (95.2× Earth)', period: '29.45 years', temp: '-140°C', moons: '146 (Titan, Enceladus...)',
        gravity: '10.44 m/s² (1.06g)', orbSpeed: '9.68 km/s', escapeVel: '35.50 km/s',
        pressure: '1,000 bar', core: 'Metallic H₂ / Rocky Core',
        composition: '96.3% H₂ / 3.25% He / Ice Rings',
        feature: 'Extensive ring system (282,000 km wide, 10m thick)',
        gradient: [['#F0DFAB', 0], ['#D4B979', 0.4], ['#A3894A', 1]],
        atmosphere: 'rgba(220, 200, 140, 0.14)',
        atmosphereSize: 1.14,
        hasRings: true,
        currentScale: 1.0,
      },
      {
        name: 'URANUS', distance: 370, radius: 7.8, speed: 0.0048,
        angle: Math.random() * Math.PI * 2, au: '19.2 AU (2.87B km)',
        diameter: '50,724 km', mass: '8.68 × 10²⁵ kg (14.5× Earth)', period: '84.01 years', temp: '-195°C (Coldest Mantle)', moons: '28 (Titania, Oberon...)',
        gravity: '8.69 m/s² (0.89g)', orbSpeed: '6.80 km/s', escapeVel: '21.30 km/s',
        pressure: '100 bar', core: 'Mantle of Water, Ammonia, Methane',
        composition: '83% H₂ / 15% He / 2% CH₄ Ice',
        feature: 'Axis tilt of 97.77° (rotates virtually on its side)',
        gradient: [['#8EE0ED', 0], ['#62BAC9', 0.5], ['#3F91A0', 1]],
        atmosphere: 'rgba(130, 220, 235, 0.2)',
        atmosphereSize: 1.2,
        hasThinRings: true,
        currentScale: 1.0,
      },
      {
        name: 'NEPTUNE', distance: 422, radius: 7.2, speed: 0.0048,
        angle: Math.random() * Math.PI * 2, au: '30.1 AU (4.50B km)',
        diameter: '49,244 km', mass: '1.02 × 10²⁶ kg (17.1× Earth)', period: '164.79 years', temp: '-200°C', moons: '16 (Triton...)',
        gravity: '11.15 m/s² (1.14g)', orbSpeed: '5.43 km/s', escapeVel: '23.50 km/s',
        pressure: '1,000+ bar', core: 'Silicate Core / Water Ice Mantle',
        composition: '80% H₂ / 19% He / Methane Traces',
        feature: 'Supersonic winds up to 2,100 km/h (fastest in Solar System)',
        gradient: [['#477BE6', 0], ['#2D5EC2', 0.5], ['#1B4099', 1]],
        atmosphere: 'rgba(70, 120, 240, 0.22)',
        atmosphereSize: 1.22,
        currentScale: 1.0,
      }
    ];

    const asteroids = Array.from({ length: 110 }, () => ({
      distance: 205 + Math.random() * 30,
      angle:    Math.random() * Math.PI * 2,
      speed:    (Math.random() * 0.0008 + 0.0003) * (Math.random() > 0.5 ? 1 : -1),
      size:     Math.random() * 1.1 + 0.3,
    }));

    let animationId;
    let currentHoverPlanet = null;
    let time = 0;

    /* ── ANIMATE LOOP ── */
    const animate = () => {
      time += 0.003;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const sunX = width  / 2 + (mouse.x !== null ? (mouse.x - width  / 2) * 0.025 : 0);
      const sunY = height / 2 + (mouse.y !== null ? (mouse.y - height / 2) * 0.025 : 0);

      // Stars
      starsBack.forEach(s => {
        s.phase += s.speed;
        ctx.globalAlpha = Math.sin(s.phase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
      });
      starsMid.forEach(s => {
        s.phase += s.speed;
        ctx.globalAlpha = Math.sin(s.phase) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      const zoomFactor = 1 + zoomProgressRef.current * 8;

      /* ── SUN ── */
      const sunR = (width < 600 ? 22 : 28) * zoomFactor;

      const corona = ctx.createRadialGradient(sunX, sunY, sunR * 0.2, sunX, sunY, sunR * 3.6);
      corona.addColorStop(0,    'rgba(255, 245, 157, 0.4)');
      corona.addColorStop(0.35, 'rgba(255, 215, 0, 0.18)');
      corona.addColorStop(1,    'transparent');
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR * 3.6, 0, Math.PI * 2);
      ctx.fillStyle = corona;
      ctx.fill();

      const sunSurface = ctx.createRadialGradient(sunX - sunR*0.25, sunY - sunR*0.25, 0, sunX, sunY, sunR);
      sunSurface.addColorStop(0,   '#FFFFFF');
      sunSurface.addColorStop(0.35, '#FFF59D');
      sunSurface.addColorStop(0.75, '#FFD54F');
      sunSurface.addColorStop(1,   '#F57F17');
      ctx.beginPath();
      ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
      ctx.fillStyle = sunSurface;
      ctx.fill();

      /* ── Asteroids ── */
      asteroids.forEach(ast => {
        ast.angle += ast.speed * (1 + zoomProgressRef.current * 2);
        const ad = ast.distance * zoomFactor;
        const ax = sunX + Math.cos(ast.angle) * ad;
        const ay = sunY + Math.sin(ast.angle) * ad;
        ctx.beginPath();
        ctx.arc(ax, ay, ast.size * (0.6 + zoomProgressRef.current * 0.4), 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(180, 160, 140, 0.4)';
        ctx.fill();
      });

      currentHoverPlanet = null;

      /* ── Orbit Tracks & Planets ── */
      planets.forEach(planet => {
        planet.angle += planet.speed * (1 + zoomProgressRef.current * 3.5);
        if (planet.moonAngle !== undefined) planet.moonAngle += 0.04;

        const currentDist = planet.distance * zoomFactor;
        const px = sunX + Math.cos(planet.angle) * currentDist;
        const py = sunY + Math.sin(planet.angle) * currentDist;

        let isHovered = false;
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - px, dy = mouse.y - py;
          if (Math.sqrt(dx*dx + dy*dy) < planet.radius * planet.currentScale + 16) {
            isHovered = true;
            currentHoverPlanet = planet;
          }
        }

        const targetScale = isHovered ? 2.8 : 1.0;
        planet.currentScale += (targetScale - planet.currentScale) * 0.08;

        const baseRadius = planet.radius * (1 + zoomProgressRef.current * 0.6);
        const renderedRadius = baseRadius * planet.currentScale;

        // Orbit Line
        ctx.beginPath();
        ctx.arc(sunX, sunY, currentDist, 0, Math.PI * 2);
        ctx.strokeStyle = isHovered ? 'rgba(255, 235, 59, 0.4)' : 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = isHovered ? 1.5 : 1;
        ctx.stroke();

        // Saturn Rings
        if (planet.hasRings) {
          ctx.beginPath();
          ctx.ellipse(px, py, renderedRadius * 2.2, renderedRadius * 0.55, Math.PI / 12, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(240, 220, 160, 0.65)';
          ctx.lineWidth = 6 * (renderedRadius / 10);
          ctx.stroke();
        }

        // Atmosphere
        if (planet.atmosphere) {
          const aGlow = ctx.createRadialGradient(px, py, renderedRadius * 0.8, px, py, renderedRadius * planet.atmosphereSize);
          aGlow.addColorStop(0, planet.atmosphere);
          aGlow.addColorStop(1, 'transparent');
          ctx.beginPath();
          ctx.arc(px, py, renderedRadius * planet.atmosphereSize, 0, Math.PI * 2);
          ctx.fillStyle = aGlow;
          ctx.fill();
        }

        // Surface
        const surfaceGrad = ctx.createRadialGradient(
          px - renderedRadius * 0.3, py - renderedRadius * 0.3, renderedRadius * 0.05,
          px, py, renderedRadius
        );
        planet.gradient.forEach(([color, stop]) => surfaceGrad.addColorStop(stop, color));
        ctx.beginPath();
        ctx.arc(px, py, renderedRadius, 0, Math.PI * 2);
        ctx.fillStyle = surfaceGrad;
        ctx.fill();

        if (planet.currentScale > 1.1) {
          ctx.beginPath();
          ctx.arc(px, py, renderedRadius * 1.35, 0, Math.PI * 2);
          ctx.strokeStyle = '#F62440';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });

      setHoveredPlanetData(currentHoverPlanet);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const tl = gsap.timeline();
    tl.fromTo(titleRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.2, ease: 'power3.out' }
    );
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 10 },
      { opacity: 0.7, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5'
    );
    tl.fromTo(progressBarRef.current,
      { width: '0%' },
      {
        width: '100%', duration: 1.6, ease: 'power2.inOut',
        onUpdate: function () { 
          const currentPct = Math.floor(this.progress() * 100);
          setPercent(currentPct); 
        },
        onComplete: () => {
          setIsLoaded(true);
          gsap.to(progressRef.current, { opacity: 0, duration: 0.3, display: 'none' });
          gsap.fromTo(buttonRef.current,
            { opacity: 0, scale: 0.9, display: 'inline-flex' },
            { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
          );
        }
      }
    );

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [onEnter]);

  // Click handler for entering home page
  const handleEnterClick = () => {
    gsap.to(zoomProgressRef, {
      current: 1.0, duration: 1.1, ease: 'power3.inOut',
      onUpdate: () => {
        if (containerRef.current) containerRef.current.style.opacity = 1 - zoomProgressRef.current;
      },
      onComplete: () => {
        onEnter();
      }
    });
  };

  return (
    <div ref={containerRef} className="universe-landing-wrapper">
      <canvas ref={canvasRef} className="universe-canvas" />

      {/* Comprehensive Astrophysics Scientific HUD Side Panel */}
      {hoveredPlanetData ? (
        <div className="planet-scientific-hud glass-panel">
          <div className="hud-header">
            <span className="hud-badge">TARGET LOCKED // TELEMETRY ACTIVE</span>
            <h2 className="hud-planet-name">{hoveredPlanetData.name}</h2>
            <span className="hud-planet-au">{hoveredPlanetData.au}</span>
          </div>

          <div className="hud-specs-grid">
            <div className="spec-box"><span className="spec-label">DIAMETER</span><span className="spec-val">{hoveredPlanetData.diameter}</span></div>
            <div className="spec-box"><span className="spec-label">MASS</span><span className="spec-val">{hoveredPlanetData.mass}</span></div>
            <div className="spec-box"><span className="spec-label">GRAVITY</span><span className="spec-val">{hoveredPlanetData.gravity}</span></div>
            <div className="spec-box"><span className="spec-label">ORBIT SPEED</span><span className="spec-val">{hoveredPlanetData.orbSpeed}</span></div>
            <div className="spec-box"><span className="spec-label">ORBIT PERIOD</span><span className="spec-val">{hoveredPlanetData.period}</span></div>
            <div className="spec-box"><span className="spec-label">SURFACE TEMP</span><span className="spec-val">{hoveredPlanetData.temp}</span></div>
            <div className="spec-box"><span className="spec-label">ESCAPE VELOCITY</span><span className="spec-val">{hoveredPlanetData.escapeVel}</span></div>
            <div className="spec-box"><span className="spec-label">PRESSURE</span><span className="spec-val">{hoveredPlanetData.pressure}</span></div>
            <div className="spec-box full-width"><span className="spec-label">CORE STRUCTURE</span><span className="spec-val">{hoveredPlanetData.core}</span></div>
            <div className="spec-box full-width"><span className="spec-label">ATMOSPHERE / COMPOSITION</span><span className="spec-val">{hoveredPlanetData.composition}</span></div>
            <div className="spec-box full-width highlight-feature"><span className="spec-label">NOTABLE FEATURE</span><span className="spec-val">{hoveredPlanetData.feature}</span></div>
          </div>
        </div>
      ) : (
        <div className="astrophysics-hud hud-left">
          <div className="hud-metric"><span className="hud-label">STAR:</span> SOL (YELLOW DWARF G2V)</div>
          <div className="hud-metric"><span className="hud-label">SURFACE TEMP:</span> 5,778 K</div>
          <div className="hud-metric"><span className="hud-label">TELEMETRY:</span> {isLoaded ? 'HOVER PLANET TO INSPECT' : 'INITIALIZING SYSTEM...'}</div>
        </div>
      )}

      {/* Centre panel */}
      <div className="universe-center-panel">
        <h1 ref={titleRef} className="universe-title">DEVIL37 // HELIOS</h1>
        <p ref={subtitleRef} className="universe-subtitle">SOLAR SYSTEM ARCHITECTURE</p>

        <div ref={progressRef} className="universe-progress-container">
          <div className="progress-track"><div ref={progressBarRef} className="progress-fill" /></div>
          <span className="progress-percentage">INITIALIZING // {percent}%</span>
        </div>

        <button ref={buttonRef} onClick={handleEnterClick} className="btn-enter-system" style={{ display: 'none' }}>
          ENTER SYSTEM ↗
        </button>
      </div>

      <style>{`
        .universe-landing-wrapper {
          position: fixed; inset: 0;
          background: #000000;
          z-index: 99999;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          font-family: var(--font-sans);
        }
        .universe-canvas {
          position: absolute; inset: 0;
          width: 100%; height: 100%; z-index: 1;
        }

        .astrophysics-hud {
          position: absolute; top: 24px; left: 24px; z-index: 3;
          font-family: var(--font-mono); font-size: 0.62rem;
          color: rgba(255,255,255,0.4);
          line-height: 1.8;
          border-left: 2px solid var(--accent-red);
          padding-left: 10px;
          pointer-events: none;
        }
        .hud-label { color: var(--accent-red); font-weight: 600; }

        .planet-scientific-hud {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 10;
          width: 340px;
          padding: 18px;
          background: rgba(7, 7, 10, 0.95) !important;
          border: 1px solid var(--accent-red) !important;
          box-shadow: 0 0 30px rgba(246, 36, 64, 0.28);
          animation: fadeIn 0.25s ease;
          max-height: 85vh;
          overflow-y: auto;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }

        .hud-header {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
          margin-bottom: 12px;
        }
        .hud-badge {
          font-family: var(--font-mono);
          font-size: 0.58rem;
          color: var(--accent-red);
          letter-spacing: 2px;
          display: block;
          margin-bottom: 2px;
        }
        .hud-planet-name {
          font-family: var(--font-sans);
          font-size: 1.45rem;
          font-weight: 800;
          color: #FFFFFF;
          margin: 0;
        }
        .hud-planet-au {
          font-family: var(--font-mono);
          font-size: 0.72rem;
          color: var(--text-secondary);
        }
        .hud-specs-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px 10px;
        }
        .spec-box {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .spec-box.full-width {
          grid-column: span 2;
        }
        .highlight-feature {
          border-top: 1px solid var(--border-color);
          padding-top: 6px;
          margin-top: 4px;
        }
        .highlight-feature .spec-val {
          color: #F59E0B;
        }
        .spec-label {
          font-family: var(--font-mono);
          font-size: 0.55rem;
          color: var(--text-muted);
          text-transform: uppercase;
        }
        .spec-val {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .universe-center-panel {
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 20px; max-width: 440px; width: 100%;
        }
        .universe-title {
          font-size: clamp(1.8rem, 6vw, 2.4rem); font-weight: 800;
          color: #ffffff; margin-bottom: 8px; letter-spacing: 3px;
          text-shadow: 0 0 20px rgba(255, 235, 59, 0.2);
        }
        .universe-subtitle {
          font-family: var(--font-mono); font-size: clamp(0.65rem, 2vw, 0.75rem);
          color: var(--text-secondary); letter-spacing: 2px; margin-bottom: 24px;
        }

        .universe-progress-container {
          width: 100%; max-width: 260px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
        }
        .progress-track { width: 100%; height: 2px; background: rgba(255,255,255,0.08); }
        .progress-fill { height: 100%; width: 0%; background: var(--accent-red); box-shadow: 0 0 10px var(--accent-red); }
        .progress-percentage { font-family: var(--font-mono); font-size: 0.68rem; color: var(--text-secondary); }

        .btn-enter-system {
          background: transparent; color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.3);
          padding: 10px 32px; font-family: var(--font-sans);
          font-size: 0.78rem; font-weight: 600; letter-spacing: 2px;
          cursor: pointer; border-radius: var(--border-radius-sm);
          transition: all 0.3s ease;
        }
        .btn-enter-system:hover {
          background: #ffffff; color: #000000;
          box-shadow: 0 0 25px rgba(255, 255, 255, 0.25);
        }

        @media (max-width: 768px) {
          .planet-scientific-hud {
            top: 70px;
            left: 12px;
            right: 12px;
            width: auto;
            max-width: 360px;
            margin: 0 auto;
          }
          .astrophysics-hud { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default UniverseLanding;
