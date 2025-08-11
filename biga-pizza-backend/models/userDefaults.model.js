import mongoose from 'mongoose';

const DoughDefaultsSchema = new mongoose.Schema(
  {
    numberOfPizzas: { type: Number, required: true, min: 1, max: 50 },
    ballWeightGrams: { type: Number, required: true, min: 100, max: 1000 },

    doughHydrationPercent: { type: Number, required: true, min: 40, max: 80 },
    doughBigaPercent: { type: Number, required: true, min: 40, max: 100 },

    bigaHydrationPercent: { type: Number, required: true, min: 35, max: 60 },
    yeastType: { type: String, required: true, enum: ['IDY', 'ADY', 'FRESH'] },

    bigaFermentationHours: { type: Number, required: true, min: 6, max: 36 },
    bigaFermentationTempC: { type: Number, required: true, min: 4, max: 35 },
    doughFermentationHours: { type: Number, required: true, min: 4, max: 72 },
    doughFermentationTempC: { type: Number, required: true, min: 4, max: 35 },

    bigaYeastPercentOfBigaFlour: {
      type: Number,
      required: true,
      min: 0,
      max: 2,
    },
    refreshYeastPercentOfRefreshFlour: {
      type: Number,
      required: true,
      min: 0,
      max: 2,
    },
    saltPercentOfTotalFlour: { type: Number, required: true, min: 0, max: 5 },
    maltPercentOfTotalFlour: { type: Number, required: true, min: 0, max: 5 },
  },
  { _id: false }
);

const ScheduleDefaultsSchema = new mongoose.Schema(
  {
    bigaPrepTimeMin: { type: Number, required: true, min: 0, max: 300 },
    bigaRisingTimeMin: { type: Number, required: true, min: 0, max: 3000 },
    autolyzeRefreshPrepMin: { type: Number, required: true, min: 0, max: 300 },
    autolyzeRefreshRestMin: { type: Number, required: true, min: 0, max: 300 },
    doughPrepTimeMin: { type: Number, required: true, min: 0, max: 300 },
    doughRisingTimeMin: { type: Number, required: true, min: 0, max: 3000 },
    ballsPrepTimeMin: { type: Number, required: true, min: 0, max: 300 },
    ballsRisingTimeMin: { type: Number, required: true, min: 0, max: 3000 },
    preheatOvenDurationMin: { type: Number, required: true, min: 0, max: 300 },
    toppingsPrepTimeMin: { type: Number, required: true, min: 0, max: 300 },
  },
  { _id: false }
);

const UserDefaultsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      index: true,
    },
    doughDefaults: { type: DoughDefaultsSchema, required: true },
    scheduleDefaults: { type: ScheduleDefaultsSchema, required: true },
    version: { type: Number, default: 1 },
  },
  { timestamps: true }
);

const UserDefaults = mongoose.model('UserDefaults', UserDefaultsSchema);
export default UserDefaults;
