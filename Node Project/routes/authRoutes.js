const express = require('express');
const router = express.Router();

const User = require("../models/user");

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send("Username already taken.");
        }

        // Create a new user
        const newUser = new User({ username, password });
        await newUser.save();

        // Redirect to login page after successful registration
        res.redirect("/auth/login");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

// Login (sign-in)
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400);
        }

        // Compare the entered password with the hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400);
        }

        const sessionUser = await User.findOne({ username });

        req.session.user = sessionUser;
        req.session.userId = sessionUser._id;
        

        // Redirect to dashboard
        res.redirect("/books");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

router.get("/logout", (req, res) => {
    // Destroy the session to log the user out
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("Error logging out");
        }

        // Redirect to the login page after logout
        res.redirect("/auth/login");
    });
});



module.exports = router;
