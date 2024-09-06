const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const {validateListing} = require("../middleware.js");

const listingController = require("../controllers/listing.js");

const multer  = require('multer');      
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

// index route
router.get("/", wrapAsync(listingController.index));

router.get("/search", (req,res)=>{
    console.log("hello");
});

// new route
router.get("/new", isLoggedIn, listingController.renderNewForm);  

// show route
router.get("/:id", wrapAsync(listingController.showListings));

// create route
router.post("/", isLoggedIn, upload.single('listing[image]'), listingController.processImageData, validateListing, wrapAsync(listingController.createListing));

// edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// update
router.put("/:id", isLoggedIn, isOwner, upload.single('listing[image]'), listingController.processImageDataUpdate, validateListing, wrapAsync(listingController.updateListing));

// delete
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;