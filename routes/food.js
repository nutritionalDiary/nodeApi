const express = require("express");
const foodController = require("../controllers/foodController");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/', authMiddleware, foodController.all);
router.post('/get-user-foods', authMiddleware, foodController.getUserFoods);
router.get('/:id', authMiddleware, foodController.get);
router.post('/', authMiddleware, foodController.create);
router.post('/add-user-food', authMiddleware, foodController.addUserFood);
router.put('/:id', authMiddleware, foodController.update);
router.delete('/:id', authMiddleware, foodController.delete);

module.exports = router;