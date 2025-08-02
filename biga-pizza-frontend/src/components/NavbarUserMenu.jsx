// components/NavbarUserMenu.jsx
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useRecipe } from '@context/RecipeContext';

export default function NavbarUserMenu() {
  const { user, logout } = useAuth();
  const { setSettingsDrawerOpen } = useRecipe();
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Hello, {user.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/my-recipes')}>
          📋 My Recipes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate('/account')}>
          👤 Account
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSettingsDrawerOpen(true)}>
          ⚙️ Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>🔓 Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
