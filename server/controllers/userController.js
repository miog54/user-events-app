const User = require('../models/User');
const Event = require('../models/Event');

exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
      const { page = 1, limit = 10, sortField = 'createdAt', sortOrder = 'asc' } = req.query;
  
      const users = await User.find()
        .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('events');
  
      const totalUsers = await User.countDocuments();
  
      res.status(200).json({
        users,
        totalPages: Math.ceil(totalUsers / limit),
        currentPage: Number(page),
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.getUser = async (req, res) => {
    try {
      const { page = 1, limit = 10, sortField = 'startDate', sortOrder = 'asc' } = req.query;
  
      const user = await User.findById(req.params.id).populate({
        path: 'events',
        options: {
          sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 },
          skip: (page - 1) * limit,
          limit: Number(limit),
        },
      });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const totalEvents = await Event.countDocuments({ user: user._id });
  
      res.status(200).json({
        user,
        totalPages: Math.ceil(totalEvents / limit),
        currentPage: Number(page),
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

exports.createEvent = async (req, res) => {
  try {
    const { title, description, startDate, endDate } = req.body;
    const userId = req.params.userId;

    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start <= new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)) {
      return res.status(400).json({ error: 'You can only create events starting from tomorrow' });
    }

    const overlappingEvent = await Event.findOne({
      user: userId,
      $or: [
        { startDate: { $lt: endDate, $gt: startDate } },
        { endDate: { $lt: endDate, $gt: startDate } },
        { startDate: { $lt: startDate }, endDate: { $gt: startDate } },
        { startDate: { $lt: endDate }, endDate: { $gt: endDate } }
      ]
    });

    if (overlappingEvent) {
      return res.status(400).json({ error: 'You can’t create event for this time' });
    }

    const event = new Event({ title, description, startDate, endDate, user: userId });
    await event.save();

    await User.findByIdAndUpdate(userId, { $push: { events: event._id } });

    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      await Event.deleteMany({ user: user._id });
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: 'User and related events deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.deleteEvent = async (req, res) => {
    try {
      const event = await Event.findById(req.params.eventId);
      if (!event) {
        return res.status(404).json({ error: 'Event not found' });
      }
      await Event.findByIdAndDelete(req.params.eventId);
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  exports.updateUser = async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  exports.updateEvent = async (req, res) => {
    try {
      const { title, description, startDate, endDate } = req.body;
      const eventId = req.params.eventId;
      const userId = req.params.userId;
  
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const overlappingEvent = await Event.findOne({
        user: userId,
        _id: { $ne: eventId },
        $or: [
          { startDate: { $lt: endDate, $gt: startDate } },
          { endDate: { $lt: endDate, $gt: startDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: startDate } },
          { startDate: { $lte: endDate }, endDate: { $gte: endDate } }
        ]
      });
  
      if (overlappingEvent) {
        return res.status(400).json({ error: 'You can’t update event to this time' });
      }
  
      const updatedEvent = await Event.findByIdAndUpdate(eventId, { title, description, startDate, endDate }, { new: true });
      if (!updatedEvent) {
        return res.status(404).json({ error: 'Event not found' });
      }
  
      res.status(200).json(updatedEvent);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };