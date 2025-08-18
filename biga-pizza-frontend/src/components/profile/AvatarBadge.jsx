// src/components/profile/AvatarBadge.jsx
import React from 'react';
import KaleidoSticksAvatar from './KaleidoSticksAvatar';
import { MandalaCanvas } from './AvatarGenerator';

export default function AvatarBadge({
  type = 'kaleido', // 'kaleido' | 'mandala'
  seed = 'BigaPizza',
  size = 24, // perfect for navbar
  rounded = true,
  className = '',
}) {
  return type === 'kaleido' ? (
    <KaleidoSticksAvatar
      seed={seed}
      size={size}
      rounded={rounded}
      className={className}
    />
  ) : (
    <MandalaCanvas seed={seed} size={size} className={className} />
  );
}
