import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  unit: String,
});

const stepSchema = new mongoose.Schema({
  time: Date,
  description: String,
});

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    // Core inputs
    numberOfPizzas: Number,
    doughBallWeight: Number,
    hydration: Number,
    bigaPercent: Number,
    saltPercent: Number,
    maltPercent: Number,

    // Yeast + fermentation
    yeastType: String,
    bigaYeastPercent: Number,
    finalDoughYeastPercent: Number,
    bigaFermentationTime: Number,
    doughFermentationTime: Number,
    bigaTemp: Number,
    doughTemp: Number,

    // Timeline inputs
    bakingDateTime: Date,
    bigaPrepTime: Number,
    bigaRisingTime: Number,
    autolyzeRefreshPrep: Number,
    autolyzeRefreshRest: Number,
    doughPrepTime: Number,
    doughRisingTime: Number,
    ballsPrepTime: Number,
    ballsRisingTime: Number,
    preheatOvenDuration: Number,
    toppingsPrepTime: Number,

    // Derived data
    ingredients: [ingredientSchema],
    steps: [stepSchema],
    notes: String,

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true },
);

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
