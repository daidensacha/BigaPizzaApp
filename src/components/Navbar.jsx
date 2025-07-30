import { Link } from "react-router-dom";
import { useRecipe } from "../context/RecipeContext";
import ThemeToggle from "./ui/ThemeToggle";

// Inside a header/nav/top-right corner


export default function Navbar() {

  const { setSettingsDrawerOpen } = useRecipe();

  return (
    <nav className="bg-white dark:bg-stone-900 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-stone-700 px-4 py-3 shadow flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-red-600">
        BigaPizza
      </Link>
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200">
          Home
        </Link>
        <Link to="/menu" className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200">
          Pizza's
        </Link>
        <Link to="/create-recipe" className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200">
          Create Recipe
        </Link>
        <button
          onClick={() => setSettingsDrawerOpen(true)}
          className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
        >
          Settings
        </button>


        <ThemeToggle />
      </div>
    </nav>
  );
}
