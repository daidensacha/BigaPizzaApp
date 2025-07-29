import React from "react";

const pizzaMenu = [
  {
    name: "Margherita",
    description: "Tomato sauce, fresh mozzarella, basil, extra virgin olive oil",
    image: "/images/margherita.jpg", // Place your image in public/images/
  },
  {
    name: "Diavola",
    description: "Spicy salami, tomato sauce, mozzarella, chili oil",
    image: "/images/diavola.jpg",
  },
  {
    name: "Funghi",
    description: "Cream base, mozzarella, mushrooms, thyme, garlic oil",
    image: "/images/funghi.jpg",
  },
];

export default function PizzaMenu() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-red-100 dark:from-stone-900 dark:to-stone-800 p-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-yellow-400 mb-10">
        Pizza Menu
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pizzaMenu.map((pizza, index) => (
          <div
            key={index}
            className="bg-white dark:bg-stone-900 rounded-xl shadow-md border border-gray-200 dark:border-stone-700 overflow-hidden"
          >
            <img
              src={pizza.image}
              alt={pizza.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-2">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-yellow-300">{pizza.name}</h2>
              <p className="text-sm text-gray-600 dark:text-stone-400">{pizza.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
