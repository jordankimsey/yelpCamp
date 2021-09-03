const express = require('express');
//mergeParams allows us to access params in app.js and this file
//otherwise we cannot access information id and object is empty
const router = express.Router({ mergeParams: true });
const {validateReview, isLoggedIn, isReviewAuthor} = require('../middleware')
const Campground = require("../models/campground");
const Review = require('../models/review');
const reviews = require('../controllers/reviews');

const catchAsync = require('../utilities/catchAsync');
const ExpressError = require('../utilities/ExpressError');

//reviews post route
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));
  
  router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;
