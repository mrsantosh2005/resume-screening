import React, { useEffect, useRef } from 'react';

const FloatingLines = ({ 
  enabledWaves = ["top","middle","bottom"],
  lineCount = 5,
  lineDistance = 5,
  bendRadius = 5,
  bendStrength = -0.5,
  interactive = true,
  parallax = true
}) => {
  const canvasRef = useRef(null);
  const animationRef = useRef();
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    if (interactive) {
      const handleMouseMove = (e) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
      };
      window.addEventListener('mousemove', handleMouseMove);
    }
    
    const drawLines = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Determine which waves to draw
      const wavePositions = {
        top: height * 0.2,
        middle: height * 0.5,
        bottom: height * 0.8
      };
      
      enabledWaves.forEach(waveKey => {
        const yPos = wavePositions[waveKey];
        if (!yPos) return;
        
        // Get line count for this wave
        const count = Array.isArray(lineCount) 
          ? lineCount[enabledWaves.indexOf(waveKey)] || 5
          : lineCount;
        
        // Get line distance for this wave
        const distance = Array.isArray(lineDistance)
          ? lineDistance[enabledWaves.indexOf(waveKey)] || 5
          : lineDistance;
        
        // Calculate offset for this wave
        const waveOffset = yPos - (count * distance) / 2;
        
        for (let i = 0; i < count; i++) {
          const y = waveOffset + (i * distance);
          ctx.beginPath();
          
          // Create wave pattern
          for (let x = 0; x <= width; x += 20) {
            let amplitude = bendRadius * 10;
            let frequency = 0.01;
            let phase = Date.now() * 0.002;
            
            // Add mouse interaction
            if (interactive && mouseRef.current.x) {
              const dx = x - mouseRef.current.x;
              const dy = y - mouseRef.current.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (distance < 200) {
                amplitude += (200 - distance) * 0.2 * bendStrength;
              }
            }
            
            // Parallax effect
            if (parallax && mouseRef.current.x) {
              const parallaxOffset = (mouseRef.current.x - width/2) * 0.0005;
              phase += parallaxOffset * (i + 1);
            }
            
            const offsetY = Math.sin(x * frequency + phase) * amplitude * bendStrength;
            const pointY = y + offsetY;
            
            if (x === 0) {
              ctx.moveTo(x, pointY);
            } else {
              ctx.lineTo(x, pointY);
            }
          }
          
          // Style the lines
          ctx.strokeStyle = `rgba(79, 70, 229, ${0.1 + (i / count) * 0.15})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      });
      
      animationRef.current = requestAnimationFrame(drawLines);
    };
    
    drawLines();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [enabledWaves, lineCount, lineDistance, bendRadius, bendStrength, interactive, parallax]);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
};

export default FloatingLines;