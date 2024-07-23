const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/:userId/events', userController.createEvent);
router.delete('/:id', userController.deleteUser);
router.delete('/:userId/events/:eventId', userController.deleteEvent);
router.put('/:id', userController.updateUser);
router.put('/:userId/events/:eventId', userController.updateEvent);


module.exports = router;
