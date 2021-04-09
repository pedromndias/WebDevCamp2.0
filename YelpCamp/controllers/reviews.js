/* Pattern called MVC - Model View Controller frame, an approach on structuring 
apps */

/* In this file we will export specific functions that contain the logic for the
reviews route. We need to require these functions on that route file */

// Require the reviews model:
const Review = require("../models/review");
// Reqiore the camprounds model:
const Campground = require("../models/campground");

// Create a review function:
module.exports.createReview = async(req, res) => {
    // Get the corresponding camground by its id:
    const campground = await Campground.findById(req.params.id);
    // Get the body.review of the review and create it:
    const review = new Review(req.body.review);
    // We can associate a new review with a logged in user (req.user is automatically added when we log in so we can use its id):
    review.author = req.user._id;
    // Push it to the Campground model reviews array:
    campground.reviews.push(review);
    // Then we save the review and the campground in our database:
    await review.save();
    await campground.save();
    // Let's show a flash message if the review was successfully posted:
    req.flash("success", "Created new review!");
    // Then redirect to that campgrounds show page:
    res.redirect(`/campgrounds/${campground._id}`);
}

// Delete review function:
module.exports.deleteReview = async (req, res) => {
    // Destructure the id's:
    const {id, reviewId} = req.params;
    // We need to find that campground and update it, using the $pull mongodb operator to remove the specific review from the reviews array:
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    // We find that specific review and delete it:
    await Review.findByIdAndDelete(reviewId);
    // Let's show a flash message if the review was successfully deleted:
    req.flash("success", "Successfully deleted review");
    // Redirec to that campground:
    res.redirect(`/campgrounds/${id}`);
}