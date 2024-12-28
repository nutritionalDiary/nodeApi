const db = require('../db');
const { Food } = require('../models/models');

exports.all = async (req, res) => {
    try {
        const foods = await Food.findAll({ order: [['time', 'DESC']] }); // ['name', 'ASC']
        res.status(200).json(foods);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const food = await Food.findOne({ where: {'id': id} });

        if(food == null)
        {
            return res.status(404).json("Ce repas n'existe pas");    
        }
        res.status(200).json(food);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.create = async (req, res) => {
    const { name, calories, time, userId } = req.body;
    try {
        //const userId = req.userData.userId;
        const food = await Food.create({ name, calories, time, userId });
        
        res.status(201).json({ message: "Repas ajouté avec succès", "food": food });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}


exports.update = async (req, res) => {
    
    const { id } = req.params;
    const { name, calories, time } = req.body;

    try {
        const food = await Food.findOne({ where: { "id": id }});
        
        if(food != null)
        {
            if(name != null) food.name = name;
            if(calories != null) food.calories = calories;
            if(time != null) food.time = time;

            food.save();
        
            res.status(200).json({ message: "Repas modifié avec succès", "food": food });
        } else {
            return res.status(404).json({ message: "Repas inexistant" });
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
        const deletedFood = await Food.destroy({ where: { "id": id }});

        if(deletedFood > 0)
        {
            res.status(200).json({ message: "Repas supprimé avec succès" });
        }
        else res.status(404).json({ message: "Repas inexistante" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}