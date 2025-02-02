const Book = require("../models/Book");
const User = require("../models/user");

// Add a new book
exports.addBook = async (req, res) => {
    try {
        const book = await Book.create(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getBooks = async (req, res) => {
    try {

        if (!req.session.user) {
            return res.redirect('/auth/login');
        }
        


        const sessionUser = await User.findById(req.session.userId).populate('books');

        const books = sessionUser.books || [];
        const finishedCount = countFinished(sessionUser);
        const readingCount = countReading(sessionUser)

        res.render("books", { user: sessionUser, books: books, finishedCount: finishedCount, readingCount: readingCount });

    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching books");
    }
};

exports.getBookById = async (req, res) => {

    const book = await Book.findById(req.params.id);
    res.render("edit", {book});
    
};

exports.updateBook = async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    const { title, author, genre, totalPages, currentPage, status, format } = req.body;
    try {
        
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, genre, totalPages, currentPage, status, format },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).send('Book not found');
        }

        res.redirect('/books');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating the book');
    }
};

exports.deleteBook = async (req, res) => {

    if (!req.session.user) {
        return res.redirect('/auth/login');
    }

    try {

        const sessionUser = await User.findById(req.session.userId);
        if (!sessionUser) return res.status(404).json({ message: "User not found" });

        sessionUser.books.pull(req.params.id);
        await sessionUser.save();

        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) return res.status(404).json({ message: "Book not found" });

        res.json({ message: "Book deleted successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

function countFinished(user) {
    count = 0;

    user.books.forEach(book => {
        if(book.status == "finished") {
            count++;
        }
    });
    return count;
}
function countReading(user) {
    count = 0;

    user.books.forEach(book => {
        if(book.status == "reading") {
            count++;
        }
    });
    return count;
}
