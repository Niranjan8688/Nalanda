const express = require('express');
const {
  addBook,
  updateBook,
  deleteBook,
  getBooks
} = require('../controllers/bookController');
const { protect } = require('../middlewear/authMiddleWare');
const { role } = require('../middlewear/roleMiddleware');
const router = express.Router();
router.post('/addBook',protect,role(["Admin"]),addBook)
router.post('/getAllBooks',protect , getBooks)
router.put('/updateBook' , protect , role(["Admin"]),updateBook)
router.delete('/deleteBook' , protect , role(["Admin"]),deleteBook )

module.exports = router;
