const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, password: hashedPassword });
    await admin.save();

    const token = jwt.sign({ adminId: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(201).json({ token, admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ adminId: admin._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token, admin });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findById(req.admin.adminId);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    if (email) admin.email = email;
    if (password) admin.password = await bcrypt.hash(password, 10);

    await admin.save();

    res.status(200).json(admin);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
