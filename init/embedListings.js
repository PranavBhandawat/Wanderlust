require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../models/listing");
const { embed, listingToText } = require("../utils/embeddings");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
    console.log("Connected to DB");

    const listings = await Listing.find({});
    console.log(`Embedding ${listings.length} listings...`);

    for (const listing of listings) {
        listing.embedding = await embed(listingToText(listing));
        await listing.save();
        console.log(`${listing.title} done`);
    }

    console.log("Completed.");
    await mongoose.connection.close();
}

main().catch((err) => {
    console.error(err);
    mongoose.connection.close();
});