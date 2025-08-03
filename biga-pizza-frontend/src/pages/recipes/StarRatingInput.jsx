import React, { useState } from 'react';
import { Star } from 'lucide-react';

export default function StarRatingInput({ value = 0, onChange }) {
  const [hoverValue, setHoverValue] = useState(undefined);

  const handleClick = (index) => {
    const newValue = index === value ? index - 0.5 : index;
    onChange(newValue);
  };

  const handleMouseMove = (index, e) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - left < width / 2;
    setHoverValue(isHalf ? index - 0.5 : index);
  };

  const getColor = (index) => {
    const current = hoverValue ?? value;
    if (index <= current) return 'text-yellow-400';
    if (index - 0.5 === current) return 'text-yellow-300';
    return 'text-gray-300 dark:text-stone-600';
  };

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          key={index}
          type="button"
          className="relative"
          onClick={() => onChange(index)}
          onMouseMove={(e) => handleMouseMove(index, e)}
          onMouseLeave={() => setHoverValue(undefined)}
        >
          <Star
            size={20}
            className={`transition-colors ${getColor(index)}`}
            fill={
              (hoverValue ?? value) >= index ? 'currentColor' : 'transparent'
            }
          />
          {(hoverValue ?? value) === index - 0.5 && (
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <Star size={20} className="text-yellow-300" fill="currentColor" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
