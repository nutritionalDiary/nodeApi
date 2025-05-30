const express = require('express');
const router = express.Router();
const {
  searchFoods,
  getFoodDetails,
  getFoodImages,
} = require('../controllers/searchFoodController');

// Route pour rechercher des repas par nom
router.get('/search', searchFoods);

// Route pour récupérer les détails d'un repas spécifique
router.get('/details/:foodId', getFoodDetails);

// Route pour récupérer les images d'un dossier Google Drive
router.get('/images', getFoodImages);

module.exports = router;
