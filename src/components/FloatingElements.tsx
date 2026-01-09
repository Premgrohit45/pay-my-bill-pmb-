import { useEffect, useState } from 'react';

interface FloatingShape {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  type: 'circle' | 'square' | 'triangle' | 'hexagon';
  color: string;
  delay: number;
  duration: number;
}

export const FloatingElements = () => {
  const [shapes, setShapes] = useState<FloatingShape[]>([]);

  useEffect(() => {
    const colors = [
      'hsl(var(--primary) / 0.1)',
      'hsl(var(--secondary) / 0.1)',
      'hsl(var(--accent) / 0.1)',
      'hsl(var(--success) / 0.08)',
    ];

    const types: FloatingShape['type'][] = ['circle', 'square', 'triangle', 'hexagon'];

    const generateShapes = () => {
      const newShapes: FloatingShape[] = [];
      for (let i = 0; i < 8; i++) {
        newShapes.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 20 + Math.random() * 60,
          rotation: Math.random() * 360,
          type: types[Math.floor(Math.random() * types.length)],
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 5,
          duration: 15 + Math.random() * 20,
        });
      }
      setShapes(newShapes);
    };

    generateShapes();
  }, []);

  const renderShape = (shape: FloatingShape) => {
    const baseStyle = {
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      width: shape.size,
      height: shape.size,
      animationDelay: `${shape.delay}s`,
      animationDuration: `${shape.duration}s`,
    };

    switch (shape.type) {
      case 'circle':
        return (
          <div
            key={shape.id}
            className="absolute rounded-full animate-float-drift pointer-events-none"
            style={{
              ...baseStyle,
              backgroundColor: shape.color,
            }}
          />
        );
      case 'square':
        return (
          <div
            key={shape.id}
            className="absolute rounded-lg animate-float-spin pointer-events-none"
            style={{
              ...baseStyle,
              backgroundColor: shape.color,
              transform: `rotate(${shape.rotation}deg)`,
            }}
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            className="absolute animate-float-drift pointer-events-none"
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              borderLeft: `${shape.size / 2}px solid transparent`,
              borderRight: `${shape.size / 2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              backgroundColor: 'transparent',
            }}
          />
        );
      case 'hexagon':
        return (
          <div
            key={shape.id}
            className="absolute animate-float-spin pointer-events-none"
            style={{
              ...baseStyle,
              backgroundColor: shape.color,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {shapes.map(renderShape)}
    </div>
  );
};

export const Particles3D = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-accent/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
      
      {/* Grid lines */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Floating dots */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export const WaveAnimation = () => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="absolute bottom-0 w-full h-full"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill="hsl(var(--primary) / 0.05)"
          className="animate-wave"
        />
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          fill="hsl(var(--secondary) / 0.03)"
          className="animate-wave-slow"
          style={{ animationDelay: '1s' }}
        />
      </svg>
    </div>
  );
};