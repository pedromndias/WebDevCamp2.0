// In this file we create a middlewares to use on routes.

// We need to require our Joi validation schemas (this is not mongoose):
const {campgroundSchema, reviewSchema} = require("./schemas");
// Require our ExpressError class:
const ExpressError = require("./utils/ExpressError");
// Require our Campground model:
const Campground = require("./models/campground");
// Require our Review model:
const Review = require("./models/review");

// Let's create a middleware function to check if a user is logged in:
module.exports.isLoggedIn = (req, res, next) => {
    // Only a logged in user should be able to do certain things like create a campground, post a review, etc:
    if(!req.isAuthenticated()){
        req.flash("error", "You must be signed in first");
        return res.redirect("/login");
    }
    // If the user is authenticated, we move on:
    next();
}

// Let's create a middleware function to validate our campground data together with Joi:
module.exports.validateCampground = (req, res, next) => {
    // We pass the data through to the schema:
    const {error} = campgroundSchema.validate(req.body);
    if(error) {
        // If there's an error, get the array of the error details and map it into a string:
        const msg = error.details.map(el => el.message).join(",")
        // Pass that message string with statusCode 400:
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

// Let's create a middleware function to check if the author of a campground is the currentUser:
module.exports.isAuthor = async(req, res, next) => {
    // We destructure the id from req.params:
    const {id} = req.params;
    // Then find that campground by its id:
    const campground = await Campground.findById(id);
    // If the author is not the currentUser we flash a message and redirect:
    if(!campground.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    // If the author is the currentUser, we move on:
    next();
}

// Let's create another middleware function to validate our review data together with Joi:
module.exports.validateReview = (req, res, next) => {
    // Check for an error when we pass the data:
    const {error} = reviewSchema.validate(req.body);
    if(error) {
        // If there's an error, get the array of the error details and map it into a string:
        const msg = error.details.map(el => el.message).join(",")
        // Pass that message string with statusCode 400:
        throw new ExpressError(msg, 400)
    }
    // Otherwise we're all good:
    else {
        next();
    }
}

// The next middleware makes sure only the owner of a review should be able to delete it:
module.exports.isReviewAuthor = async(req, res, next) => {
    // We destructure the id and reviewId from req.params:
    const {id, reviewId} = req.params;
    // Then find that review by its id:
    const review = await Review.findById(reviewId);
    // If the author is not the currentUser we flash a message and redirect:
    if(!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${id}`);
    }
    // If the author is the currentUser, we move on:
    next();
}