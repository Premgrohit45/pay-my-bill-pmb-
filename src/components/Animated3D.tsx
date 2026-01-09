import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export const AnimatedCube3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 200;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    const size = 50;

    // Cube vertices
    const vertices: Point[] = [
      { x: -size, y: -size, z: -size, vx: 0, vy: 0, vz: 0 },
      { x: size, y: -size, z: -size, vx: 0, vy: 0, vz: 0 },
      { x: size, y: size, z: -size, vx: 0, vy: 0, vz: 0 },
      { x: -size, y: size, z: -size, vx: 0, vy: 0, vz: 0 },
      { x: -size, y: -size, z: size, vx: 0, vy: 0, vz: 0 },
      { x: size, y: -size, z: size, vx: 0, vy: 0, vz: 0 },
      { x: size, y: size, z: size, vx: 0, vy: 0, vz: 0 },
      { x: -size, y: size, z: size, vx: 0, vy: 0, vz: 0 },
    ];

    // Edges connecting vertices
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0], // Front face
      [4, 5], [5, 6], [6, 7], [7, 4], // Back face
      [0, 4], [1, 5], [2, 6], [3, 7], // Connecting edges
    ];

    let angleX = 0;
    let angleY = 0;
    let angleZ = 0;

    const rotateX = (point: Point, angle: number): Point => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        ...point,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos,
      };
    };

    const rotateY = (point: Point, angle: number): Point => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        ...point,
        x: point.x * cos + point.z * sin,
        z: -point.x * sin + point.z * cos,
      };
    };

    const rotateZ = (point: Point, angle: number): Point => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        ...point,
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos,
      };
    };

    const project = (point: Point) => {
      const fov = 300;
      const scale = fov / (fov + point.z);
      return {
        x: point.x * scale + centerX,
        y: point.y * scale + centerY,
        scale,
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate vertices
      const rotated = vertices.map(v => {
        let p = rotateX(v, angleX);
        p = rotateY(p, angleY);
        p = rotateZ(p, angleZ);
        return p;
      });

      // Project to 2D
      const projected = rotated.map(project);

      // Draw edges
      ctx.strokeStyle = 'hsl(220 90% 56% / 0.6)';
      ctx.lineWidth = 2;

      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(projected[i].x, projected[i].y);
        ctx.lineTo(projected[j].x, projected[j].y);
        ctx.stroke();
      });

      // Draw vertices
      projected.forEach((p, i) => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8 * p.scale);
        gradient.addColorStop(0, 'hsl(220 90% 70% / 0.9)');
        gradient.addColorStop(1, 'hsl(260 80% 60% / 0.3)');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      angleX += 0.01;
      angleY += 0.015;
      angleZ += 0.005;

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[200px] h-[200px] opacity-80"
      style={{ filter: 'drop-shadow(0 0 20px hsl(220 90% 56% / 0.3))' }}
    />
  );
};

export const AnimatedSphere3D = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 150;
    const height = 150;
    canvas.width = width;
    canvas.height = height;

    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 50;

    // Generate points on sphere surface
    const points: Point[] = [];
    for (let i = 0; i < 50; i++) {
      const phi = Math.acos(-1 + (2 * i) / 50);
      const theta = Math.sqrt(50 * Math.PI) * phi;
      points.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.sin(theta) * Math.sin(phi),
        z: radius * Math.cos(phi),
        vx: 0, vy: 0, vz: 0
      });
    }

    let angle = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotate and project points
      const projected = points.map(p => {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = p.x * cos + p.z * sin;
        const z = -p.x * sin + p.z * cos;
        const y = p.y;
        
        const fov = 200;
        const scale = fov / (fov + z);
        
        return {
          x: x * scale + centerX,
          y: y * scale + centerY,
          z,
          scale,
          alpha: (z + radius) / (2 * radius)
        };
      });

      // Sort by z for proper layering
      projected.sort((a, b) => a.z - b.z);

      // Draw points
      projected.forEach(p => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 4 * p.scale);
        gradient.addColorStop(0, `hsl(260 80% 65% / ${0.3 + p.alpha * 0.7})`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.scale, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      angle += 0.02;
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-[150px] h-[150px] opacity-70"
      style={{ filter: 'drop-shadow(0 0 15px hsl(260 80% 60% / 0.4))' }}
    />
  );
};