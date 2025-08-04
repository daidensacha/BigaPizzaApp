import mongoose from 'mongoose';

// const ingredientSchema = new mongoose.Schema({
//   name: String,
//   amount: Number,
//   unit: String,
// });

// const stepSchema = new mongoose.Schema({
//   time: Date,
//   description: String,
// });

const recipeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    formData: {
      type: Object,
      required: true,
    },
    scheduleData: {
      type: Object,
      required: false, // allow null or undefined
      default: null,
    },
    calculatedData: {
      ingredients: {
        type: Object,
        required: true,
      },
      timelineSteps: {
        type: [Object],
        required: true,
      },
    },
    notes: {
      type: String,
      default: '',
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
