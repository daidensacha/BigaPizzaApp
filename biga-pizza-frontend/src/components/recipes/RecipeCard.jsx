import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { updateRecipeNotes } from '@/services/recipeService';
import { toast } from 'react-hot-toast';
import { Star } from 'lucide-react';
import ConfirmDeleteDialog from '@ui/ConfirmDeleteDialog';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import StarRatingInput from './StarRatingInput';
import { updateRecipeImage } from '@/services/recipeService';

const handleImageUpload = async (file) => {
  if (!file) return;
  try {
    await uploadRecipeImage(recipe._id, file, user.token);
    toast.success('Image uploaded!');
    // Ideally: update image state or trigger a re-fetch
  } catch (err) {
    console.error(err);
    toast.error('Failed to upload image.');
  }
};

export default function RecipeCard({ recipe, onDelete }) {
  const [note, setNote] = useState(recipe.notes || '');
  const [rating, setRating] = useState(recipe.rating || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [localImage, setLocalImage] = useState(recipe.image);
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  const handleUpload = () => {
    if (!window.cloudinary) return;

    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        folder: 'recipe/user_uploads',
        sources: ['local', 'url', 'camera'],
        cropping: false,
        multiple: false,
        maxFiles: 1,
      },
      async (error, result) => {
        if (!error && result.event === 'success') {
          const uploadedUrl = result.info.secure_url;
          console.log('📸 Uploaded image URL:', uploadedUrl);

          try {
            // ✅ Save the image URL to the recipe
            // await updateRecipeNotes(
            //   recipe._id,
            //   {
            //     image: uploadedUrl,
            //   },
            //   user.token
            // );
            await updateRecipeImage(
              recipe._id,
              result.info.secure_url,
              user.token
            );
            setLocalImage(result.info.secure_url);

            toast.success('Image saved!');
            // Optionally refresh the recipe or update local state
          } catch (err) {
            console.error('❌ Failed to save image to DB:', err);
            toast.error('Failed to save image.');
          }
        }
      }
    );

    widget.open();
  };

  const handleConfirmDelete = async () => {
    await onDelete(recipe._id);
    setShowDialog(false); // close dialog after deletion
  };

  // Detect if notes changed
  const isDirty = note !== (recipe.notes || '');

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateRecipeNotes(recipe._id, { notes: note, rating }, user.token);
      console.log('Saving recipe with ID:', recipe._id);
      setIsSaved(true);
      toast.success('Notes saved!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save notes.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleStarClick = async (value) => {
    setRating(value);
    setIsSaved(false);
    setIsSaving(true);
    try {
      await updateRecipeNotes(
        recipe._id,
        { notes: note, rating: value },
        user.token
      );
      console.log('Saving star rating with ID:', recipe._id);
      setIsSaved(true);
      toast.success('Rating saved!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save rating.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        'Are you sure you want to delete this recipe? This cannot be undone.'
      )
    ) {
      onDelete(recipe._id);
    }
  };

  const formattedDate = new Date(recipe.createdAt).toLocaleDateString();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start gap-4 p-4 bg-white dark:bg-stone-800 bg-opacity-50 dark:bg-opacity-50 border border-gray-200 dark:border-stone-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {/* Left Column */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold text-stone-700 dark:text-yellow-400">
          {recipe.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-stone-400">
          Created on: {formattedDate}
        </p>

        {/* Star Rating */}
        <StarRatingInput value={rating} onChange={handleStarClick} />
        <div className="flex items-center gap-1 mt-2">
          {/* {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={18}
              className={`cursor-pointer transition
                ${
                  star <= rating
                    ? 'fill-yellow-400 stroke-yellow-500'
                    : 'stroke-gray-400 dark:stroke-stone-500'
                }
              `}
              onClick={() => handleStarClick(star)}
            />
          ))} */}
        </div>

        {/* Notes */}
        <textarea
          rows={2}
          placeholder="Add notes about this recipe..."
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
            setIsSaved(false);
          }}
          className="mt-3 w-full p-2 rounded border border-gray-300 dark:border-stone-600 bg-white dark:bg-stone-700 text-sm text-stone-800 dark:text-white"
        />

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className={`mt-2 px-3 py-1 rounded text-sm font-medium transition
            ${
              isSaving
                ? 'bg-gray-400 text-white'
                : isDirty
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-300 text-gray-600 cursor-default'
            }
          `}
        >
          {isSaving ? 'Saving...' : isSaved ? '✓ Saved' : 'Save Notes'}
        </button>

        <div className="t-3 mx-3 inline-block">
          {/* Replace this with Headless UI dialog trigger */}
          <button
            onClick={() => setShowDialog(true)}
            className="text-sm text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>

        <Link
          to={`/account/recipes/${recipe._id}`}
          className="mt-3 inline-block text-green-600 dark:text-emerald-400 text-sm hover:underline font-medium"
        >
          View / Edit Recipe →
        </Link>
      </div>

      {/* Right Column: Image Upload WIdget goes here  */}
      <div className="w-full md:w-32 h-48 relative group rounded overflow-hidden bg-gray-900">
        {/* Display Image or Placeholder */}
        <img
          src={localImage || '/images/placeholder.jpg'}
          alt="Biga"
          className="w-full h-full object-cover"
        />

        {/* Transparent Upload Button (covers entire image) */}
        <button
          type="button"
          onClick={handleUpload}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          title="Upload image"
          aria-label="Upload image"
        />

        {/* Overlay Text on Hover */}
        {/* <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-xs opacity-0 group-hover:opacity-100 transition z-20">
          Change Image
        </div> */}
      </div>

      {/* Headless UI Confirm Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleConfirmDelete}
        recipeTitle={recipe.title}
      />
    </div>
  );
}
