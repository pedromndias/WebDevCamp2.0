/* Pattern called MVC - Model View Controller frame, an approach on structuring 
apps */

/* In this file we will export specific functions that contain the logic for the
users route. We need to require these functions on that route file */

// Require User from the models directory:
const User = require("../models/user");

// Render register form function:
module.exports.renderRegister = (req, res) => {
    res.render("users/register")
}

// Register user function:
module.exports.register = async(req, res, next) => {
    // Let's try and catch any error when registering a user:
    try {
        // And we take the form data and create a new user:
        // Destructure the data from req.body:
        const {email, username, password} = req.body;
        // Pass email and username in an object into the new User
        const user = new User({email, username});
        // Use Passport method to register the user with hashed password:
        const registeredUser = await User.register(user, password);
        // If successfully registered, we want to log the user in:
        req.login(registeredUser, err => {
            // If any error:
            if(err) return next(err);
            // If no error then display success flash message:
            req.flash("success", "Welcome to Yelp Camp!");
            // And redirect to /campgrounds:
            res.redirect("/campgrounds");
        });

    } catch(e) {
        // If something is wrong we will flash the error:
        req.flash("error", e.message);
        // And redirect back to /register:
        res.redirect("register");
    }
}

// Render login form function:
module.exports.renderLogin = (req, res) => {
    res.render("users/login");
}

// Login function:
module.exports.login = (req, res) => {
    // If successfully logged in we flash a message:
    req.flash("success", "Welcome back!");
    // Let's set a variable with the url the user was trying to access before being 
    // asked to log in. If user was not trying to access any route then show /campgrounds:
    const redirectUrl = req.session.returnTo || "/campgrounds";
    // Then we delete "returnTo" from the session object:
    delete req.session.returnTo;
    // Redirect to that url:
    res.redirect(redirectUrl);
}

// Logout function:
module.exports.logout = (req, res) => {
    // Passport has a method called logout:
    req.logout();
    // Flash a logout success message:
    req.flash("success", "Goodbye!");
    // Redirect to campgrounds:
    res.redirect("/campgrounds");
}