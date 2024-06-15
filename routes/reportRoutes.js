const express = require('express');
const {
  getMostBorrowedBooks,
  getActiveMembers,
  getBookAvailability
} = require('../controllers/reportController');
const { protect } = require('../middlewear/authMiddleWare');
const { role } = require('../middlewear/roleMiddleware');
const router = express.Router();

router.get('/most-borrowed' , protect , role(['Admin']) ,getMostBorrowedBooks );
router.get('/active-members',protect, role(['Admin']), getActiveMembers)
router.get('/book-availability',protect, role(['Admin']), getBookAvailability)

module.exports = router;
