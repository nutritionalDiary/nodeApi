const express = require("express");
const restaurantController = require("../controllers/restaurantController");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/', authMiddleware, restaurantController.all);
router.get('/:id', authMiddleware, restaurantController.get);
router.post('/', authMiddleware, restaurantController.create);
router.put('/:id', authMiddleware, restaurantController.update);
router.delete('/:id', authMiddleware, restaurantController.delete);

module.exports = router;