const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const { embed, listingToText } = require("../utils/embeddings");

const { retrieveListings } = require("../utils/retrieve");
const { generateRecommendation } = require("../utils/generate");

module.exports.index = async (req, res) => {
    let q = req.query.q;
    let category = req.query.category; 
    let searchResult;

    let allListings;
    if (category) {
        allListings = await Listing.find({ category }); // exact match on the category
        console.log(allListings);         
    } else if (q && q.trim()) {

        const results = await retrieveListings(q, 5);     // top 5 relevant listings
        const allListings = results.map((r) => r.listing);   // the listing docs for the cards

        try{
            searchResult = await generateRecommendation(q, results);  // the AI paragraph
        } catch(e){
            console.log("Concierge unavailable: ", e.message);
        }

        console.log(searchResult);

        return res.render("./listings/index.ejs", { allListings, category, searchResult });
    } else {
        allListings = await Listing.find();
    }

    res.render("./listings/index.ejs", { allListings, category, searchResult });
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path: "reviews", 
        populate: {
        path: "author",
        },
    }).populate("owner"); //chaining of populate
    console.log(listing);
    if(!listing){
        req.flash("error", "Requested Listing doesn't exist.");
        return res.redirect("/listings");
    };
    console.log(listing);
    res.render("./listings/show.ejs", { listing });
};

module.exports.renderNewListingForm = async (req, res) => {
    console.log(req.user); // the moment a user gets logged in, their log in info is stored in the req object by default
    res.render("./listings/new.ejs");
}

module.exports.createListing = async (req, res) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; //to save the owner as well
    
    if(req.file){
        let url = req.file.path;
        let filename = req.file.filename;
        newListing.image = {filename, url};
    }

    newListing.geometry = response.body.features[0].geometry;

    newListing.embedding = await embed(listingToText(newListing));

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    console.log(id);
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "The Listing you are trying to edit, doesn't exist.");
        return res.redirect("/listings");
    };

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("./listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, {new: true});

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    }).send();
    listing.geometry = response.body.features[0].geometry;

    if(typeof req.file !== "undefined"){
        listing.image.url = req.file.path;
        listing.image.filename = req.file.filename;                             
    }

    listing.embedding = await embed(listingToText(listing));
    
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.json({ redirect: `/listings/${id}` });
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.json({ redirect: "/listings" });  
};