const db = require('../db');
const { Restaurant } = require('../models/models');
const { Op } = require('sequelize');
//const { sequelize } = require("../sequelize");
const { sequelize } = require("../models/models");
const fs = require('fs');
const path = require('path');

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
            attributes: {
                include: [
                    [sequelize.literal(`ST_DistanceSphere(coordinates, ST_MakePoint(${lng}, ${lat}))`), 'distance']
                ]
            },
            order: [
                [sequelize.literal(`distance`), 'ASC']
            ],
            limit: 10
        });
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

exports.importFromGeoJSON = async (req, res) => {
    const filePath = path.join(__dirname, '../resources/geojson/restaurants.geojson');
    //const filePath = '../resources/geojson/restaurant.geojson';
    try {
        const restaurantsNb = await Restaurant.findAll({ order: [['name', 'ASC']] });

        if(restaurantsNb.length > 100)
        {
            return res.status(400).json({ message: "Les données ont déjà été importées" });
        }
        else
        {
            const data = fs.readFileSync(filePath, 'utf8');
            const geojson = JSON.parse(data);
                            
            const restaurants = geojson.features.map(feature => ({
                name: feature.properties.name == null ? "Restaurant" : feature.properties.name,
                coordinates: { type: 'Point', coordinates: feature.geometry.coordinates },
                tel: feature.properties["contact:phone"],
                address: `${feature.properties["addr:city"] == null ? "" : feature.properties["addr:city"]} || 
                ${feature.properties["addr:housenumber"] == null ? "" : feature.properties["addr:housenumber"]} || 
                ${feature.properties["addr:street"] == null ? "" : feature.properties["addr:street"]}`
            }));
    
            await Restaurant.bulkCreate(restaurants);
    
            res.status(201).json({ message: "Données importées avec succès" });
        }
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}