const express = require("express");
const router = express.Router(); //express.Router is a function
const wrapAsync = require("../utils/wrapAync.js");
const Listing = require("../models/listing.js"); //we use ".." becasue we want to go to the parent folder, not a file within this folder
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get(wrapAsync(listingController.index)) //Index Route
    .post(isLoggedIn, validateListing, upload.single('listing[image]'), wrapAsync(listingController.createListing)); //Create Route

//New Route
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewListingForm));

router
    .route("/:id")
    .get(wrapAsync(listingController.showListing)) //Show Route
    .put(isLoggedIn, isOwner, upload.single('listing[image]'),validateListing, wrapAsync(listingController.updateListing)) //Update Route
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing)); //Delete Route

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;