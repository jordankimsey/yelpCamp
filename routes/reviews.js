const express = require('express');
//mergeParams allows us to access params in app.js and this file
//otherwise we cannot access information id and object is empty
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require('../schemas.js');

const Campground = require("../models/campground");
const Review = require('../models/review');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');




//middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
      //maps over errors if multiple and joins each error with coma
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
  }
  

//reviews post route
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    //structured from form so review[rating] key = review
    const review = new Review(req.body.review);
    //set this in model to reviews array
    campground.reviews.push(review);
    await review.save();
  await campground.save();
  req.flash('success', 'Created new review')
    res.redirect(`/campgrounds/${campground._id}`);
  }));
  
  router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    //pull operator removes from existing array all instances of a value or specified condition
    //pulls from reviews array and gets reviewId and updates campground to remove review from page
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    //takes reviewId and deletes 
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/campgrounds/${id}`);
  }));

module.exports = router;
