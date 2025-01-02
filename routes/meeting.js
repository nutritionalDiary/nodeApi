const express = require("express");
const meetingController = require("../controllers/meetingController");
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.get('/', authMiddleware, meetingController.all);
router.get('/meetings/:id', authMiddleware, meetingController.get);
router.get('/user-meetings', authMiddleware, meetingController.userMeetings);
router.post('/', authMiddleware, meetingController.create);
router.post('/meet', authMiddleware, meetingController.takeMeeting);
router.put('/:id', authMiddleware, meetingController.update);
router.delete('/:id', authMiddleware, meetingController.delete);

module.exports = router;