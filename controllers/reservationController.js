const db = require('../db');
const { Reservation } = require('../models/models');
const { Restaurant } = require('../models/models');

exports.all = async (req, res) => {
    try {
        const reservations = await Reservation.findAll({ order: [['date', 'DESC']] });
        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const reservation = await Reservation.findOne({ where: { 'id': id } });

        if(reservation == null)
        {
            return res.status(404).json("Cette reservation n'existe pas");    
        }
        res.status(200).json(reservation);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.userReservations = async (req, res) => {

    try {
        const userId = req.userData.userId;

        const reservations = await Reservation.findAll({
            where: { 'userId': userId },
            order: [['date', 'DESC']],
            include: [{ model: Restaurant }]
        });
        //const reservations = await Reservation.findOne({ where: { 'userId': userId }, order: [['date', "DESC"]] });

        res.status(200).json(reservations);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res
 * 
 */
exports.create = async (req, res) => {
    const { date, nb_personnes, userId, restaurantId } = req.body;
    try {
        //const userId = req.userData.userId;
        const reservation = await Reservation.create({ date, nb_personnes, userId, restaurantId });
        
        res.status(201).json({ message: "Reservation créée avec succès", "reservation": reservation });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.makeReservation = async (req, res) => {
    const { date, nb_personnes, restaurantId } = req.body;
    try {
        const userId = req.userData.userId;
        const reservation = await Reservation.create({ date, nb_personnes, userId, restaurantId });
        
        res.status(201).json({ message: "Reservation créée avec succès", "reservation": reservation });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.update = async (req, res) => {
    
    const { id } = req.params;
    const { date, nb_personnes, userId, restaurantId } = req.body;

    try {
        const reservation = await Reservation.findOne({ where: { "id": id }});
        
        if(reservation != null)
        {
            if(date != null) reservation.date = date;
            if(nb_personnes != null) reservation.nb_personnes = nb_personnes;
            if(userId != null) reservation.userId = userId;
            if(restaurantId != null) reservation.restaurantId = restaurantId;

            reservation.save();
        
            res.status(200).json({ message: "Reservation modifiée avec succès", "reservation": reservation });
        } else {
            return res.status(404).json({ message: "Reservation inexistante" });
        }
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.delete = async (req, res) => {

    const { id } = req.params;

    try {
        const deletedReservation = await Reservation.destroy({ where: { "id": id }});

        if(deletedReservation > 0)
        {
            res.status(200).json({ message: "Reservation supprimée avec succès" });
        }
        else res.status(404).json({ message: "Reservation inexistante" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}