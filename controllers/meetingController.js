const db = require('../db');
const { Meeting } = require('../models/models');

exports.all = async (req, res) => {
    try {
        const meetings = await Meeting.findAll({ order: [['date', 'DESC']] });
        res.status(200).json(meetings);
    } catch (err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.get = async (req, res) => {
    const { id } = req.params;

    try {
        const meeting = await Meeting.findOne({ where: { 'id': id } });

        if(meeting == null)
        {
            return res.status(404).json("Ce rendez-vous n'existe pas");    
        }
        res.status(200).json(meeting);
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
    const { date, reason, userId, dietitianId } = req.body;
    try {
        //const userId = req.userData.userId;
        const meeting = await Meeting.create({ date, reason, userId, dietitianId });
        
        res.status(201).json({ message: "Rendez-vous programmé avec succès", "meeting": meeting });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.takeMeeting = async (req, res) => {
    const { date, reason, dietitianId } = req.body;
    try {
        const userId = req.userData.userId;
        const meeting = await Meeting.create({ date, reason, userId, dietitianId });
        
        res.status(201).json({ message: "Rendez-vous programmé avec succès", "meeting": meeting });
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}

exports.update = async (req, res) => {
    
    const { id } = req.params;
    const { date, reason, userId, dietitianId } = req.body;

    try {
        const meeting = await Meeting.findOne({ where: { "id": id }});
        
        if(meeting != null)
        {
            if(date != null) meeting.date = date;
            if(reason != null) meeting.reason = reason;
            if(userId != null) meeting.userId = userId;
            if(dietitianId != null) meeting.dietitianId = dietitianId;

            meeting.save();
        
            res.status(200).json({ message: "Rendez-vous modifié avec succès", "meeting": meeting });
        } else {
            return res.status(404).json({ message: "Rendez-vous inexistant" });
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
        const deletedMeeting = await Meeting.destroy({ where: { "id": id }});

        if(deletedMeeting > 0)
        {
            res.status(200).json({ message: "Rendez-vous supprimé avec succès" });
        }
        else res.status(404).json({ message: "Rendez-vous inexistant" });
        
    } catch(err) {
        res.status(500).json({
            message : err.message
        });
    }
}