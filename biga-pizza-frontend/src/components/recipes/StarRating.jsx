// components/StarRating.jsx
import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, outOf = 5, size = 18 }) {
  const filledStars = Math.round(rating);
  const emptyStars = outOf - filledStars;

  return (
    <div className="flex items-center space-x-0.5">
      {[...Array(filledStars)].map((_, i) => (
        <Star
          key={`filled-${i}`}
          size={size}
          fill="currentColor"
          className="text-yellow-400"
        />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={size} className="text-gray-300" />
      ))}
    </div>
  );
}
