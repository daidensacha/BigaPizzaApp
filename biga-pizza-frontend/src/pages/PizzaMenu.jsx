import React from 'react';
import pizzaMenu from '../data/pizzaMenu'; // Correct import for named export
import PizzaCard from '../components/PizzaMenu/PizzaCard';

export default function PizzaMenu() {
  return (
    <div className="min-h-screen px-4 py-8">
      {/* remvove background gradient */}
      {/* <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-100 px-4 py-8"> */}
      <h1 className="text-3xl font-bold text-center text-stone-800 mb-10">
        Wood Fired Biga Pizza
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {pizzaMenu.map((pizza, index) => (
          <PizzaCard key={index} {...pizza} />
        ))}
      </div>
    </div>
  );
}
