const express = require('express');
const {
  getUsers,
  getUserById,
  updateUser,
  createUser,
  deleteUser,
  login
} = require('../controllers/userController');
const {protect} = require('../middlewear/authMiddleWare')
const {role} = require('../middlewear/roleMiddleware')
const router = express.Router();

router.post('/register',createUser)
router.get('/getAllUser',protect,role(['Admin']),getUsers)
router.post('/getUserById',getUserById)
router.post('/login',login)
module.exports = router;
