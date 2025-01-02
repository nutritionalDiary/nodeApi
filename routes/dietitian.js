const express = require("express");
const dietitianController = require("../controllers/dietitianController");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/'/*, authMiddleware*/, dietitianController.all);
router.get('/:id'/*, authMiddleware*/, dietitianController.get);
router.post('/'/*, authMiddleware*/, dietitianController.create);
router.put('/:id'/*, authMiddleware*/, dietitianController.update);
router.delete('/:id'/*, authMiddleware*/, dietitianController.delete);

module.exports = router;