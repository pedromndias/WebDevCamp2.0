// This file will follow the Express router methodology for the users.
const express = require("express");
// Here, instead of "app." we use "router.":
const router = express.Router();
// Require Passport to authenticate an user:
const passport = require("passport");
// Require our catchAsync to handle errors:
const catchAsync = require("../utils/catchAsync");
// Require User from the models directory:
const User = require("../models/user");
// We need to require our controller functions (methods inside an object that we will call "users")
const users = require("../controllers/users");

/* With express.Router we can chain routes with the same name (and different 
verbs). Note how we don't have to specify the path anymore, like get("/", ....) */
// Routes for ("/register"):
router.route("/register")
    // Let's define our get route to render a form:
    .get(users.renderRegister)
    // Next, we define our post route (where the form sends data to):
    .post(catchAsync(users.register));

// Now let's define our login routes. Routes for ("/login"):
router.route("/login")
    // The get route will serve a form:
    .get(users.renderLogin)
    /* The post route will do the logging in. We will use a Passport method to
    authenticate the user. It asks for the strategy (local) and to flash a message
    if failure and to redirect if failure: */
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login"}), users.login)

// Let's define a route for the user to logout:
router.get("/logout", users.logout);

// Export the router:
module.exports = router;

