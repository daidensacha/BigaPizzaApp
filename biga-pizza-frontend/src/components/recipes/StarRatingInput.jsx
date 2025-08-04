// components/recipes/StarRatingInput.jsx (new, reusable)
import { Star } from 'lucide-react';

export default function StarRatingInput({ value = 0, size = 18, onChange }) {
  return (
    <div className="flex items-center gap-1 mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          className={`cursor-pointer transition ${
            star <= value
              ? 'fill-yellow-400 stroke-yellow-500'
              : 'stroke-gray-400 dark:stroke-stone-500'
          }`}
          onClick={() => onChange(star)}
        />
      ))}
    </div>
  );
}
