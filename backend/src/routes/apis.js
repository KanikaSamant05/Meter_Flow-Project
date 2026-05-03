const express = require('express');
const router = express.Router();

const {
  createApi,
  getApis,
  getApi,
  updateApi,
  deleteApi
} = require('../controllers/apiController');

const {
  generateKey,
  listKeys
} = require('../controllers/keyController');

const { protect } = require('../middleware/auth');

// ✅ import API key middleware
const { verifyApiKey } = require('../middleware/apiKey');


// =====================================================
// 🔥 ADD HERE (BEFORE protect)
// =====================================================

router.get('/call/pokemon/:name', verifyApiKey, async (req, res) => {
  const { name } = req.params;

  const data = {
    pikachu: { type: 'electric', power: 55 },
    charizard: { type: 'fire', power: 84 }
  };

  const result = data[name.toLowerCase()];

  if (!result) {
    return res.status(404).json({
      success: false,
      message: 'Not found'
    });
  }

  res.json({
    success: true,
    user: req.user.email,
    data: result
  });
});


// =====================================================
// 🔒 KEEP YOUR EXISTING CODE BELOW
// =====================================================

router.use(protect);

router.route('/')
  .get(getApis)
  .post(createApi);

router.route('/:id')
  .get(getApi)
  .patch(updateApi)
  .delete(deleteApi);

router.route('/:apiId/keys')
  .get(listKeys)
  .post(generateKey);

module.exports = router;