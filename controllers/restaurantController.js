const db = require('../db');
const { Restaurant } = require('../models/models');
const { Op } = require('sequelize');

exports.all = async (req, res) => {
    try {
        const restaurants = await Restaurant.findAll({ order: [['name', 'ASC']] });
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await Restaurant.findOne({ where: { 'id': id } });

        if(restaurant == null)
        {
            return res.status(404).json("Ce restaurant n'existe pas");    
        }
        res.status(200).json(restaurant);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.create = async (req, res) => {
    const { name, coordinates, tel, email } = req.body;
    try {
        //const userId = req.userData.userId;
        const restaurant = await Restaurant.create({ name, coordinates, tel, email });
        
        res.status(201).json({ message: "Restaurant créé avec succès", "restaurant": restaurant });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}


exports.update = async (req, res) => {
    
    const { id } = req.params;
    const { name, coordinates, tel, email } = req.body;

    try {
        const restaurant = await Restaurant.findOne({ where: { "id": id }});
        
        if(restaurant != null)
        {
            if(name != null) restaurant.name = name;
            if(coordinates != null) restaurant.coordinates = coordinates;
            if(tel != null) restaurant.tel = tel;
            if(email != null) restaurant.email = email;

            restaurant.save();
        
            res.status(200).json({ message: "Restaurant modifié avec succès", "restaurant": restaurant });
        } else {
            return res.status(404).json({ message: "Restaurant inexistant" });
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
        const deletedRestaurant = await Restaurant.destroy({ where: { "id": id }});

        if(deletedRestaurant > 0)
        {
            res.status(200).json({ message: "Restaurant supprimé avec succès" });
        }
        else res.status(404).json({ message: "Restaurant inexistant" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.nearby = async (req, res) => {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude et longitude sont requises" });
    }

    try {
        const restaurants = await Restaurant.findAll({
            order: [
                [db.literal(`ST_Distance_Sphere(coordinates, ST_MakePoint(${lng}, ${lat}))`), 'ASC']
            ]
        });
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}