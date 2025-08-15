// src/components/profile/GeoAvatar.jsx
import { useEffect, useRef } from 'react';

const BRAND_COLORS = [
  '#d97706', // amber-600
  '#b91c1c', // red-700
  '#92400e', // amber-800
  '#78350f', // amber-900
  '#374151', // gray-700
  '#1f2937', // gray-800
];

function seededRandom(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return () => {
    h = Math.imul(48271, h) % 2147483647;
    return (h & 2147483647) / 2147483648;
  };
}

export default function GeoAvatar({
  seed = 'User',
  size = 96,
  shapesCount = 4,
  className = '',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    const rand = seededRandom(seed);

    // background
    ctx.fillStyle = BRAND_COLORS[Math.floor(rand() * BRAND_COLORS.length)];
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < shapesCount; i++) {
      ctx.save();
      const x = rand() * size;
      const y = rand() * size;
      const s = rand() * (size / 2) + size / 6;
      ctx.globalAlpha = 0.6 + rand() * 0.4;
      ctx.fillStyle = BRAND_COLORS[Math.floor(rand() * BRAND_COLORS.length)];

      const shapeType = Math.floor(rand() * 3);
      ctx.beginPath();
      if (shapeType === 0) {
        ctx.arc(x, y, s / 2, 0, Math.PI * 2);
      } else if (shapeType === 1) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + s / 2, y - s);
        ctx.lineTo(x - s / 2, y - s);
        ctx.closePath();
      } else {
        ctx.rect(x - s / 2, y - s / 2, s, s);
      }
      ctx.fill();
      ctx.restore();
    }
  }, [seed, size, shapesCount]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className={className + ' rounded-full'}
    />
  );
}
