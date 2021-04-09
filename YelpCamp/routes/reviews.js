// This file will follow the Express router methodology for the reviews:
const express = require("express");
// Here, instead of "app." we use "router.". We also have to merge params:
const router = express.Router({mergeParams: true});
// We need to require our controller functions (methods inside an object that we will call "reviews")
const reviews = require("../controllers/reviews");
// Require our middleware functions:
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware");
// Require the catchAsync function (note ".." because we need to go back one level of files):
const catchAsync = require("../utils/catchAsync");


// Let's code a route to create a review:
/* Note how we use a middleware function (validateReview) to validate our data
and isLoggedIn to make sure only logged users can create a review: */
router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));

/* The next route will delete a specific review on a campground.
    Remember that this route is "/campgrounds/id/reviews/reviewId".
    Note the middleware isLoggedIn to check if a user is logged in and
    isReviewAuthor to check if the logged in user is the author of the review: */
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;