require("dotenv").config();
const mongoose = require("mongoose");
const { retrieveListings } = require("../utils/retrieve");
const { generateRecommendation } = require("../utils/generate");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);

    const query = "a quiet mountain cabin for skiing";
    const results = await retrieveListings(query);

    console.log(`Query: "${query}"\n`);
    console.log("Retrieved:");
    results.forEach((r) => console.log("  ", r.score.toFixed(3), "-", r.listing.title));

    console.log("\nAI Concierge says:\n");
    const answer = await generateRecommendation(query, results);
    console.log(answer);

    await mongoose.connection.close();
}
main().catch(console.error);