const db = require('../db');
const { Dietitian } = require('../models/models');

exports.all = async (req, res) => {
    try {
        const dietitians = await Dietitian.findAll({ order: [['name', 'ASC']] });
        res.status(200).json(dietitians);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const dietitian = await Dietitian.findOne({ where: { 'id': id } });

        if(dietitian == null)
        {
            return res.status(404).json("Ce diététicien n'existe pas");    
        }
        res.status(200).json(dietitian);
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
        const dietitian = await Dietitian.create({ name, coordinates, tel, email });
        
        res.status(201).json({ message: "Diététicien créé avec succès", "dietitian": dietitian });
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
        const dietitian = await Dietitian.findOne({ where: { "id": id }});
        
        if(dietitian != null)
        {
            if(name != null) dietitian.name = name;
            if(coordinates != null) dietitian.coordinates = coordinates;
            if(tel != null) dietitian.tel = tel;
            if(email != null) dietitian.email = email;

            dietitian.save();
        
            res.status(200).json({ message: "Diététicien modifié avec succès", "dietitian": dietitian });
        } else {
            return res.status(404).json({ message: "Diététicien inexistant" });
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
        const deletedDietitian = await Dietitian.destroy({ where: { "id": id }});

        if(deletedDietitian > 0)
        {
            res.status(200).json({ message: "Diététicien supprimé avec succès" });
        }
        else res.status(404).json({ message: "Diététicien inexistant" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}