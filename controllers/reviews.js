const Campground = require("../models/campground");
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    //structured from form so review[rating] key = review
  const review = new Review(req.body.review);
  //adds users unique id to associate review with person who wrote it
  review.author = req.user._id;
    //set this in model to reviews array
    campground.reviews.push(review);
    await review.save();
  await campground.save();
  req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${campground._id}`);
}
  
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    //pull operator removes from existing array all instances of a value or specified condition
    //pulls from reviews array and gets reviewId and updates campground to remove review from page
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //takes reviewId and deletes 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
  }