import UserDefaults from '../models/userDefaults.model.js';
import systemDefaults from '../config/systemDefaults.js';

// Adjust to your auth; must come from server-side auth (not client body)
function getSessionUserId(req) {
  // e.g., if you set req.user in your auth middleware:
  return req.user && req.user.id;
}

export const getMyDefaults = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    let doc = await UserDefaults.findOne({ userId });
    if (!doc) {
      // lazy create with system defaults
      doc = await UserDefaults.create({
        userId,
        ...systemDefaults,
        version: 1,
      });
    }
    res.json(doc);
  } catch (err) {
    console.error('GET /api/user/defaults error', err);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateMyDefaults = async (req, res) => {
  try {
    const userId = getSessionUserId(req);
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const payload = {};
    if (req.body.doughDefaults) payload.doughDefaults = req.body.doughDefaults;
    if (req.body.scheduleDefaults)
      payload.scheduleDefaults = req.body.scheduleDefaults;

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
