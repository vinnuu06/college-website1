const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { addBook, getBooks, issueBook, getMyBooks } = require('../controllers/libraryController');

router.get('/books', getBooks);
router.post('/books', protect, authorize('admin'), addBook);
router.post('/issue', protect, authorize('admin'), issueBook);
router.get('/my-books/:studentId', protect, getMyBooks);

module.exports = router;
