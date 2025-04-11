const bcrypt = require('bcrypt');
const Admin = require('../models/admin.model');

const adminController = {
  // Admin Registration
  async adminRegister(req, res) {
    try {
      const { fullName, username, email, mobile, password } = req.body;

      if (!fullName || !username || !email || !mobile || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
      }
      const existingAdmin = await Admin.findOne({
        $or: [{ username }, { email }],
      });

      if (existingAdmin) {
        return res.status(400).json({ error: 'Admin already exists.' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new Admin({
        fullName,
        username,
        email,
        mobile,
        password: hashedPassword,
      });

      await newAdmin.save();

      return res.status(201).json({
        message: 'Admin registered successfully!',
        redirect: '/adminHome',
      });
    } catch (error) {
      console.error('Admin Registration Error:', error);
      return res
        .status(500)
        .json({ error: 'Something went wrong, please try again.' });
    }
  },

  // Admin Login
  async adminLogin(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res
          .status(400)
          .json({ error: 'Username and password are required.' });
      }
      const admin = await Admin.findOne({ username });

      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      return res.status(200).json({
        message: 'Login successful!',
        admin: {
          id: admin._id,
          username: admin.username,
          fullName: admin.fullName,
        },
      });
    } catch (error) {
      console.error('Admin Login Error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get Admin Details
  async getAdminDetails(req, res) {
    try {
      const admin = await Admin.findOne();

      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      res.json({ name: admin.fullName });
    } catch (error) {
      console.error('Error fetching admin details:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async adminLogout(req, res) {
    try {
      res.clearCookie('adminToken');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};

module.exports = adminController;
