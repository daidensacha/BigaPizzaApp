import { useAuth } from '@/context/AuthContext';
import NavbarUserMenu from '@/components/NavbarUserMenu';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeToggle from '@ui/ThemeToggle';
import { useAuthModal } from '@context/AuthModalContext';
import { useRecipe } from '@context/RecipeContext';

export default function Navbar() {
  const { openAuthModal } = useAuthModal();
  const { user, logout } = useAuth();
  const { setSettingsDrawerOpen } = useRecipe();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout(); // this clears state + hits API
      console.log('Navigating to home...');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const linkProps = user
    ? {
        to: '/editor/create',
        state: { backgroundLocation: location },
      }
    : {
        to: '/create-recipe',
      };

  return (
    <nav className="bg-white dark:bg-stone-900 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-stone-700 px-4 py-3 shadow flex justify-between items-center sticky top-0 z-50">
      <div className="flex gap-4 items-center">
        <Link to="/" className="text-xl font-bold text-red-600">
          Biga Pizza
        </Link>
        <Link
          className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
          {...linkProps}
        >
          Create Recipe
        </Link>
        <Link
          className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
          to="/menu"
        >
          Pizzas
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />
        {/* Light/Dark Toggle */}
        {!user ? (
          <button
            className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
            onClick={openAuthModal}
          >
            Login
          </button>
        ) : (
          <NavbarUserMenu
            onOpenSettings={() => setSettingsDrawerOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </div>
    </nav>
  );
}
