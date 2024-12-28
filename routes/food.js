const express = require("express");
const foodController = require("../controllers/foodController");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/', authMiddleware, foodController.all);
router.get('/:id', authMiddleware, foodController.get);
router.post('/', authMiddleware, foodController.create);
router.put('/:id', authMiddleware, foodController.update);
router.delete('/:id', authMiddleware, foodController.delete);

module.exports = router;