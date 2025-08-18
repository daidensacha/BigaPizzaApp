import UserDefaults from '../models/userDefaults.model.js';
import systemDefaults from '../config/systemDefaults.js';
import { computeYeastFromDefaults } from '../utils/computeYeastFromDefaults.js';

// assumes protect sets req.user.id
const sessionUserId = (req) => req.user?.id;

export const getMyDefaults = async (req, res) => {
  try {
    const userId = sessionUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let doc = await UserDefaults.findOne({ userId }).lean();

    // lazy-create with system defaults if none exist
    if (!doc) {
      doc = await UserDefaults.create({
        userId,
        ...systemDefaults, // { doughDefaults: {...}, scheduleDefaults: {...} }
        version: 1,
      });
      // re-read lean copy
      doc = await UserDefaults.findOne({ userId }).lean();
    }

    // Return only what the client uses
    const { doughDefaults = null, scheduleDefaults = null } = doc || {};
    return res.json({ doughDefaults, scheduleDefaults });
  } catch (err) {
    console.error('GET /api/user/defaults error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateMyDefaults = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const payload = {};
    if (req.body.doughDefaults) {
      const dough = req.body.doughDefaults;
      const yeast = computeYeastFromDefaults(dough);
      payload.doughDefaults = { ...dough, ...yeast };
    }
    if (req.body.scheduleDefaults) {
      payload.scheduleDefaults = req.body.scheduleDefaults;
    }

    const doc = await UserDefaults.findOneAndUpdate(
      { userId },
      { $set: payload, $inc: { version: 1 } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(doc);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const fields = {};
      for (const [k, v] of Object.entries(err.errors)) fields[k] = v.message;
      return res.status(400).json({ error: 'Validation failed', fields });
    }
    console.error('PUT /api/user/defaults error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const resetMyDefaults = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    // start from system defaults
    const dough = { ...systemDefaults.doughDefaults };
    const sched = { ...systemDefaults.scheduleDefaults };

    // recompute yeast % from dough defaults
    const yeast = computeYeastFromDefaults(dough);

    const payload = {
      doughDefaults: { ...dough, ...yeast },
      scheduleDefaults: { ...sched },
    };

    const doc = await UserDefaults.findOneAndUpdate(
      { userId },
      { $set: payload, $inc: { version: 1 } },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(doc);
  } catch (err) {
    console.error('POST /api/user/defaults/reset error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// export const updateDefaultsSection = async (req, res) => {
//   try {
//     const userId = sessionUserId(req);
//     if (!userId) return res.status(401).json({ error: 'Unauthorized' });

//     const { section } = req.params;
//     if (!['doughDefaults', 'scheduleDefaults'].includes(section)) {
//       return res.status(400).json({ error: 'Invalid section' });
//     }

//     const patch = req.body || {}; // frontend sends section object directly
//     const update = {
//       $set: { [section]: patch },
//       $inc: { version: 1 },
//     };

//     await UserDefaults.updateOne({ userId }, update, { upsert: true });
//     return res.json({ [section]: patch });
//   } catch (err) {
//     console.error('POST /api/user/defaults/:section error', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// // Optional: let “Restore System Defaults” really restore
// export const clearDefaultsSection = async (req, res) => {
//   try {
//     const userId = sessionUserId(req);
//     if (!userId) return res.status(401).json({ error: 'Unauthorized' });

//     const { section } = req.params;
//     if (!['doughDefaults', 'scheduleDefaults'].includes(section)) {
//       return res.status(400).json({ error: 'Invalid section' });
//     }

//     await UserDefaults.updateOne(
//       { userId },
//       { $unset: { [section]: '' }, $inc: { version: 1 } }
//     );
//     return res.json({ [section]: null });
//   } catch (err) {
//     console.error('DELETE /api/user/defaults/:section error', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// export const updateMyDefaults = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ error: 'Unauthorized' });

//     const payload = {};
//     if (req.body.doughDefaults) {
//       const dough = req.body.doughDefaults;
//       const yeast = computeYeastFromDefaults(dough);
//       payload.doughDefaults = { ...dough, ...yeast };
//     }
//     if (req.body.scheduleDefaults) {
//       payload.scheduleDefaults = req.body.scheduleDefaults;
//     }

//     const doc = await UserDefaults.findOneAndUpdate(
//       { userId },
//       { $set: payload, $inc: { version: 1 } },
//       { new: true, upsert: true, runValidators: true }
//     );

//     res.json(doc);
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       const fields = {};
//       for (const [k, v] of Object.entries(err.errors)) fields[k] = v.message;
//       return res.status(400).json({ error: 'Validation failed', fields });
//     }
//     console.error('PUT /api/user/defaults error', err);
//     res.status(500).json({ error: 'Server error' });
//   }
// };
