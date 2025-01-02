const express = require("express");
const reservationController = require("../controllers/reservationController");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/', authMiddleware, reservationController.all);
router.get('/reservations/:id', authMiddleware, reservationController.get);
router.get('/user-reservations', authMiddleware, reservationController.userReservations);
router.post('/', authMiddleware, reservationController.create);
router.post('/reserve', authMiddleware, reservationController.makeReservation);
router.put('/:id', authMiddleware, reservationController.update);
router.delete('/:id', authMiddleware, reservationController.delete);

module.exports = router;