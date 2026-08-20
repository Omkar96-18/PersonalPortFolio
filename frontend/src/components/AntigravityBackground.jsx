import React, { useEffect, useRef } from 'react';

export const AntigravityBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width  = (canvas.width  = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width  = canvas.width  = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = { x: null, y: null, radius: 110 };
    const handleMouseMove = e => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const handleMouseLeave = () => { mouse.x = null; mouse.y = null; };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const getParticleColor = isLight => {
      if (isLight) return `rgba(120,113,108,${Math.random()*0.12+0.04})`;
      const r = Math.random();
      if (r > 0.94) return `rgba(246,36,64,${Math.random()*0.5+0.2})`;  // Crimson spark
      return `rgba(248,250,252,${Math.random()*0.12+0.03})`;
    };

    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }
      reset() {
        this.x       = Math.random() * width;
        this.y       = height + Math.random() * 30;
        this.size    = Math.random() * 1.8 + 0.4;
        this.speedY  = -(Math.random() * 0.3 + 0.08);
        this.speedX  = Math.random() * 0.15 - 0.075;
        const isLight = document.body.classList.contains('light-theme');
        this.color  = getParticleColor(isLight);
      }
      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        if (mouse.x !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const d  = Math.sqrt(dx*dx + dy*dy);
          if (d < mouse.radius) {
            const f = (mouse.radius - d) / mouse.radius;
            this.x += (dx/d) * f * 1.6;
            this.y += (dy/d) * f * 1.6;
          }
        }
        if (this.y < -10 || this.x < -10 || this.x > width+10) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const count = Math.min(Math.floor((width*height)/14000), 80);
    const particles = Array.from({ length: count }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.body.classList.contains('light-theme');
      particles.forEach(p => {
        if (isLight  && p.color.includes('248,250')) p.color = getParticleColor(true);
        if (!isLight && p.color.includes('120,113')) p.color = getParticleColor(false);
        p.update();
        p.draw();
      });
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

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: -1, pointerEvents: 'none'
      }}
    />
  );
};

export default AntigravityBackground;
