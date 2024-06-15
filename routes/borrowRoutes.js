const express = require('express');
const {
  borrowBook,
  returnBook,
  getBorrowHistory
} = require('../controllers/borrowController');
const { protect } = require('../middlewear/authMiddleWare')
const { role } = require('../middlewear/roleMiddleware');
const router = express.Router();
router.post('/borrowBook' , protect , role(["Member","Admin"]), borrowBook)
router.post('/returnBook' , protect , role(["Member" , "Admin"]) , returnBook)
module.exports = router;
