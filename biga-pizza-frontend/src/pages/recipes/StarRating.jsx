// components/StarRating.jsx
import React from 'react';
import { Star, StarHalf, StarOff } from 'lucide-react';

export default function StarRating({ rating = 0, outOf = 5, size = 18 }) {
  const stars = [];

  for (let i = 1; i <= outOf; i++) {
    if (rating >= i) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="text-yellow-500"
          fill="currentColor"
        />
      );
    } else if (rating >= i - 0.5) {
      stars.push(
        <StarHalf
          key={i}
          size={size}
          className="text-yellow-500"
          fill="currentColor"
        />
      );
    } else {
      stars.push(
        <StarOff
          key={i}
          size={size}
          className="text-gray-300 dark:text-stone-500"
        />
      );
    }
  }

  return <div className="flex gap-0.5">{stars}</div>;
}
