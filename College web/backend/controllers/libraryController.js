const Book = require('../models/Book');
const LibraryRecord = require('../models/LibraryRecord');

// @desc    Add a new book
// @route   POST /api/library/books
// @access  Private (Admin)
exports.addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json({ success: true, book });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Search books
// @route   GET /api/library/books
// @access  Public
exports.getBooks = async (req, res) => {
  try {
    const { q, category } = req.query;
    const query = {};
    if (q) {
      query.$or = [
        { title: new RegExp(q, 'i') },
        { author: new RegExp(q, 'i') }
      ];
    }
    if (category) query.category = category;

    const books = await Book.find(query);
    res.status(200).json({ success: true, books });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Issue a book
// @route   POST /api/library/issue
// @access  Private (Admin)
exports.issueBook = async (req, res) => {
  try {
    const { studentId, bookId, dueDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book || book.available < 1) {
      return res.status(400).json({ success: false, message: 'Book not available' });
    }

    const record = await LibraryRecord.create({
      student: studentId,
      book: bookId,
      dueDate: new Date(dueDate)
    });

    // Update book availability
    book.available -= 1;
    await book.save();

    res.status(201).json({ success: true, record });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get student borrowed books
// @route   GET /api/library/my-books/:studentId
// @access  Private
exports.getMyBooks = async (req, res) => {
  try {
    const records = await LibraryRecord.find({ student: req.params.studentId })
      .populate('book')
      .sort({ issueDate: -1 });
    res.status(200).json({ success: true, records });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
