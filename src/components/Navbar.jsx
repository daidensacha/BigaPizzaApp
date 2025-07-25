import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow px-4 py-3 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-red-600">
        BigaPizza
      </Link>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-red-600">
          Home
        </Link>
        <Link to="/create-recipe" className="text-gray-700 hover:text-red-600">
          Create Recipe
        </Link>
        {/* Future links like: */}
        {/* <Link to="/schedule">Schedule</Link> */}
      </div>
    </nav>
  );
}
