// src/pages/recipes/NewRecipeEntry.jsx
import { useAuth } from '@/context/AuthContext';
import ModalRecipeEditor from '@/components/recipes/ModalRecipeEditor';
import CreateRecipe from '@/pages/recipes/CreateRecipe';

export default function NewRecipeEntry() {
  const { user } = useAuth();
  const isLoggedIn = !!user;
  return isLoggedIn ? <ModalRecipeEditor mode="create" /> : <CreateRecipe />;
}
