const express = require('express');
const router = express.Router();
const { listAllKeys, revokeKey, getKey } = require('../controllers/keyController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', listAllKeys);
router.route('/:keyId').get(getKey).delete(revokeKey);

module.exports = router;