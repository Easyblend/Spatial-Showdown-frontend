import React, { useEffect } from 'react';

function Background() {
  useEffect(() => {
    const canvas = document.getElementById('test');
    const ctx = canvas.getContext('2d');
    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const arc = 150;
    const size = 8;
    const gravity = 0.3;
    const parts = [];
    const colors = ['#3498db', '#e74c3c', '#f1c40f', '#8e44ad', '#2ecc71'];
    const mouse = { x: 0, y: 0 };

    // Handle window resize
    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('resize', handleResize);

    function create() {
      for (let i = 0; i < arc; i += 1) {
        parts[i] = {
          x: Math.random() * w,
          y: Math.random() * h,
          toX: Math.random() * 5 - 2.5,
          toY: Math.random() * 2 - 1 + gravity,
          c: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * size,
        };
      }
    }

    function DistanceBetween(p1, p2) {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    function updateParticles() {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < arc; i += 1) {
        const li = parts[i];
        const distanceFactor = DistanceBetween(mouse, li);
        const distance = Math.max(Math.min(15 - distanceFactor / 10, 10), 1);

        ctx.beginPath();
        ctx.arc(li.x, li.y, li.size * distance, 0, Math.PI * 2, false);
        ctx.fillStyle = li.c;
        ctx.strokeStyle = li.c;

        if (i % 2 === 0) ctx.stroke();
        else ctx.fill();

        // Update particle position
        li.x += li.toX;
        li.y += li.toY;

        // Wrap around screen
        if (li.x > w) li.x = 0;
        if (li.y > h) li.y = 0;
        if (li.x < 0) li.x = w;
        if (li.y < 0) li.y = h;
      }

      requestAnimationFrame(updateParticles);
    }

    function MouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }

    canvas.addEventListener('mousemove', MouseMove);
    create();
    updateParticles(); // Start the animation loop

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', MouseMove);
    };
  }, []);

  return (
    <canvas
      id="test"
      style={{
        backgroundColor: 'black', position: 'absolute', top: 0, left: 0, zIndex: 1,
      }}
    />
  );
}

export default Background;
