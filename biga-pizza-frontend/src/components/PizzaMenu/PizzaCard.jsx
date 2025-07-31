import React from "react";

export default function PizzaCard({ title, image, toppings }) {
  return (
    <div className="bg-white dark:bg-stone-800 border border-gray-200 dark:border-stone-700 rounded-2xl shadow-md overflow-hidden transition hover:shadow-lg">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-yellow-400 mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-stone-300">{toppings}</p>
      </div>
    </div>
  );
}
