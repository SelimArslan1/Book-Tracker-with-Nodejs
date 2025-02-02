const express = require("express");
const router = express.Router();
const bookController = require("../Controllers/bookController.js");
const Book = require("../models/Book.js");
const User = require("../models/user.js");

router.post("/", bookController.addBook);
router.get("/", bookController.getBooks);

router.get('/addBook', (req, res) => {
    res.render("addBook");
});

router.post('/addBook', async (req, res) => {
    try {
        const { title, author, genre, totalPages, currentPage, status, format } = req.body;

        const newBook = new Book({
            title,
            author,
            genre,
            totalPages,
            currentPage,
            status,
            format
        });

        await newBook.save();

        const sessionUser = await User.findById(req.session.userId);
        sessionUser.books.push(newBook._id);

        await sessionUser.save();

        res.redirect('/books');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error adding the book');
    }
});


router.get("/edit/:id", bookController.getBookById);
router.post("/edit/:id", bookController.updateBook);
router.post("/delete/:id", bookController.deleteBook);

module.exports = router;
