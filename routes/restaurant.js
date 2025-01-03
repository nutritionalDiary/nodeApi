const express = require("express");
const restaurantController = require("../controllers/restaurantController");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/'/*, authMiddleware*/, restaurantController.all);
router.get('/restaurants/:id'/*, authMiddleware*/, restaurantController.get);
router.get('/nearby'/*, authMiddleware*/, restaurantController.nearby);
router.get('/import'/*, authMiddleware*/, restaurantController.importFromGeoJSON);
router.post('/'/*, authMiddleware*/, restaurantController.create);
router.put('/:id'/*, authMiddleware*/, restaurantController.update);
router.delete('/:id'/*, authMiddleware*/, restaurantController.delete);

module.exports = router;