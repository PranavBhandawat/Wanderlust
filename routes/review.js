const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, validateReview, isReviewAuthor, isNotListingOwner } = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//POST Review Route
router.post("/", isLoggedIn, isNotListingOwner, validateReview, wrapAsync(reviewController.createReview));

//DELETE Review Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;