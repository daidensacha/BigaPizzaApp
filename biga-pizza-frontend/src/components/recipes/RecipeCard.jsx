import React from 'react';
import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { updateRecipeNotes } from '@/services/recipeService';
import { toast } from 'react-hot-toast';
// import { Star } from 'lucide-react';
import ConfirmDeleteDialog from '@ui/ConfirmDeleteDialog';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
import StarRatingInput from './StarRatingInput';
import { updateRecipeImage } from '@/services/recipeService';
import { useDropzone } from 'react-dropzone';
import * as Tooltip from '@radix-ui/react-tooltip';
import { uploadToCloudinary } from '@/utils/uploadToCloudinary';

export default function RecipeCard({ recipe, onDelete }) {
  const [note, setNote] = useState(recipe.notes || '');
  const [rating, setRating] = useState(recipe.rating || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [localImage, setLocalImage] = useState(recipe.image);
  const { user } = useAuth();
  const [showDialog, setShowDialog] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const cloudName = import.meta.env.VITE_CLOUD_NAME;
  // const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;
  // const fileInputRef = useRef(null);

  const handleImageUpload = async (url) => {
    try {
      console.log('📤 Saving image to DB:', recipe._id, url);

      await updateRecipeImage(recipe._id, url, user.token);
      setLocalImage(url);
      toast.success('Image uploaded!');
    } catch (err) {
      console.error('❌ Failed to save image to DB:', err);
      toast.error('Failed to save image.');
    }
  };

  // Inside your component:
  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        const imageUrl = await uploadToCloudinary(file); // ⬅️ Upload first
        await handleImageUpload(imageUrl); // ⬅️ Then save URL to DB
      } catch (err) {
        console.error('❌ Upload failed:', err);
        toast.error('Upload failed.');
      }
    },
    [handleImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { 'image/*': [] },
  });

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
        <div className="flex items-center gap-1 mt-2"></div>

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
      <div className="w-full md:w-32 h-48 relative group bg-gray-900 overflow-hidden rounded-lg">
        <Tooltip.Provider delayDuration={300}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div
                {...getRootProps()}
                className="w-full md:w-32 h-48 relative group rounded overflow-hidden border border-gray-200 hover:shadow-lg transition"
              >
                <input {...getInputProps()} />

                <img
                  src={localImage || recipe.image || '/images/placeholder.jpg'}
                  alt="Recipe"
                  className="w-full h-full object-cover transition duration-200 ease-in-out"
                />

                {/* Overlay text */}
                <div className="absolute inset-0 flex items-center justify-center  text-center bg-black bg-opacity-40 text-white text-xs opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  {isDragActive
                    ? 'Drop to upload…'
                    : 'Click, or drag image here to change image'}
                </div>
              </div>
            </Tooltip.Trigger>

            <Tooltip.Portal>
              <Tooltip.Content
                side="top"
                align="center"
                className="bg-black text-white px-2 py-1 text-xs rounded shadow-md z-50"
              >
                Upload a custom image for this recipe
                <Tooltip.Arrow className="fill-black" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
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
