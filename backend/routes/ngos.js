const express = require('express');
const router = express.Router();
const Ngo = require('../models/Ngo');
const { verifyFirebaseToken } = require('../middleware/auth');

// POST /api/ngos/register
router.post('/register', verifyFirebaseToken, async (req, res) => {
  try {
    const { name } = req.body;
    const uid = req.user.uid;
    const email = req.user.email;

    if (!name) {
      return res.status(400).json({ error: 'NGO name is required' });
    }

    // Check if NGO already exists
    const existingNgo = await Ngo.findOne({ uid });
    if (existingNgo) {
      return res.status(400).json({ error: 'NGO already registered' });
    }

    // Create new NGO
    const ngo = new Ngo({ uid, name, email });
    await ngo.save();

    res.status(201).json(ngo);
  } catch (err) {
    console.error('NGO registration error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
