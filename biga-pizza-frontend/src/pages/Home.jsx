import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-8 text-center">
      <h1 className="text-5xl font-bold text-gray-700 dark:text-amber-500 mb-4">
        Biga Pizza Dough App
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-200 mb-8 max-w-xl">
        Craft perfect pizza dough using the Biga method with precise
        fermentation and hydration controls. Plan your schedule, tweak
        ingredients, and master fermentation.
      </p>
      <button
        onClick={() => navigate('/create-recipe')}
        className="px-6 py-3 bg-red-500 dark:bg-red-800 hover:bg-red-600 text-white text-lg font-medium rounded-lg shadow transition"
      >
        Create Your Recipe
      </button>
    </div>
  );
}
