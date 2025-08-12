import { useAuth } from '@/context/AuthContext';
import NavbarUserMenu from '@/components/NavbarUserMenu';
import { Link } from 'react-router-dom';
import ThemeToggle from '@ui/ThemeToggle';
import { useState } from 'react';
import { useAuthModal } from '@context/AuthModalContext';
import { useRecipe } from '@context/RecipeContext';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { openAuthModal } = useAuthModal();
  const { user, logout } = useAuth();
  const { setSettingsDrawerOpen } = useRecipe();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout(); // this clears state + hits API
      console.log('Navigating to home...');
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-white dark:bg-stone-900 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-stone-700 px-4 py-3 shadow flex justify-between items-center sticky top-0 z-50">
      <div className="flex gap-4 items-center">
        <Link to="/" className="text-xl font-bold text-red-600">
          Biga Pizza
        </Link>
        <Link
          className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
          to="/recipes/new"
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
        {/* Light/Dark Toggle here if you have one */}
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

// import { Link } from 'react-router-dom';
// import { useState } from 'react';
// import { useAuthModal } from '@context/AuthModalContext';
// import { useRecipe } from '@context/RecipeContext';
// import ThemeToggle from '@ui/ThemeToggle';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '@context/AuthContext';

// // Inside a header/nav/top-right corner

// export default function Navbar() {
//   const { openAuthModal } = useAuthModal();
//   const { setSettingsDrawerOpen } = useRecipe();
//   const navigate = useNavigate();
//   const { user, logout } = useAuth();

//   console.log('user:', { user });

//   const handleLogout = async () => {
//     try {
//       await logout(); // this clears state + hits API
//       navigate('/');
//     } catch (err) {
//       console.error('Logout failed:', err);
//     }
//   };

//   return (
//     <nav className="bg-white dark:bg-stone-900 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-stone-700 px-4 py-3 shadow flex justify-between items-center sticky top-0 z-50">
//       <Link to="/" className="text-xl font-bold text-red-600">
//         BigaPizza
//       </Link>
//       <div className="flex items-center space-x-4">
//         <Link
//           to="/"
//           className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//         >
//           Home
//         </Link>
//         <Link
//           to="/menu"
//           className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//         >
//           Pizza's
//         </Link>
//         <Link
//           to="/create-recipe"
//           className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//         >
//           Create Recipe
//         </Link>
//         {user && (
//           <Link to="/my-recipes" className="text-white hover:underline">
//             My Recipes
//           </Link>
//         )}

//         {/* start register/login/logout */}
//         {user ? (
//           <>
//             {/* <span className="text-sm text-gray-600">Welcome, {user.name}</span> */}
//             <button
//               onClick={handleLogout}
//               className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={openAuthModal}
//             className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//           >
//             Login / Register
//           </button>
//         )}
//         {user && (
//           <>
//             <Link
//               to="/account"
//               className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//             >
//               Account
//             </Link>
//             {/* )} */}
//             {/* {user && ( */}
//             {/* <> */}
//             {/* <Link
//               to="/account"
//               className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//             >
//               Account
//             </Link> */}
//             {user.role === 'admin' && (
//               <Link
//                 to="/admin"
//                 className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//               >
//                 Admin
//               </Link>
//             )}
//           </>
//         )}

//         {/* end register/login/logout */}
//         <button
//           onClick={() => setSettingsDrawerOpen(true)}
//           className="text-yellow-700 hover:text-red-600 dark:text-yellow-500 dark:hover:text-red-500 focus:outline-none focus:ring-1 focus:ring-red-800 rounded-md transition-colors duration-200"
//         >
//           Settings
//         </button>
//         {/* Light/Dark theme toggle */}
//         <ThemeToggle />
//       </div>
//     </nav>
//   );
// }
