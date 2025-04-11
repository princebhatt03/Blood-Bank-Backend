const express = require('express');
const router = express.Router();
const cors = require('cors');
const authMiddleware = require('../middlewares/auth.middlewares').default;
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

router.use(
  cors({
    origin: 'https://blood-bank-frontend-oafj.onrender.com',
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
