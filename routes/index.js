const express = require('express');
const router = express.Router();
const cors = require('cors');
const authMiddleware = require('../middlewares/auth.middlewares');
const {
  userRegister,
  getAllUsers,
  deleteUser,
} = require('../controllers/user.controller');
const adminController = require('../controllers/admin.controller');
const {
  registerPatient,
  getAllPatients,
  deletePatient,
} = require('../controllers/patient.controller');

const FRONTEND_URL = process.env.FRONTEND_URL;

const LOCAL_URL = process.env.LOCAL_URL;

router.use(
  cors({
    origin: process.env.FRONTEND_URL || process.env.LOCAL_URL,
    credentials: true,
  })
);

// Redirect root to frontend
router.get('/', (req, res) => {
  res.redirect('https://blood-bank-frontend-oafj.onrender.com');
});

// ******** USER ROUTES **********
router.post('/userRegister', userRegister);
router.get('/getAllUsers', getAllUsers);
router.delete('/deleteUser/:id', deleteUser);

// ******** ADMIN ROUTES **********
router.post('/adminRegister', adminController.adminRegister);
router.post('/adminLogin', adminController.adminLogin);
router.get('/getAdminDetails', authMiddleware, adminController.getAdminDetails);
router.post('/logout', adminController.adminLogout);

// ********** PATIENT ROUTES **********
router.post('/registerPatient', registerPatient);
router.get('/getAllPatients', getAllPatients);
router.delete('/deletePatient/:id', deletePatient);

module.exports = router;
