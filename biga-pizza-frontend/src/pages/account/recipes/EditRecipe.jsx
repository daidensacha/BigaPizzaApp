// src/pages/recipes/EditRecipe.jsx  (keep file name so imports don't break)
import { useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Replace the old drawer workflow with the modal route + background
    navigate(`/editor/${id}`, {
      replace: true,
      state: {
        backgroundLocation: location.state?.backgroundLocation || {
          pathname: `/account/recipes/${id}`,
        },
      },
    });
  }, [id, navigate, location]);

  return null; // nothing to render here; we immediately route to the modal
}
