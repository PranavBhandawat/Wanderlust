const Listing = require("../models/listing");
const { embed } = require("./embeddings");

function cosineSimilarity(a, b) {
    let dot = 0;
    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
    }
    return dot;
}

// Return the topK listings most similar in meaning to the query.
async function retrieveListings(query, topK = 5) {
    const queryVector = await embed(query);

    // HARD FILTER: if the query names a country we have, restrict to it
    const countries = await Listing.distinct("country");
    const matchedCountry = countries.find(
        (c) => c && query.toLowerCase().includes(c.toLowerCase())
    );
    const dbFilter = matchedCountry ? { country: matchedCountry } : {};

    // load only the candidate listings (filtered), with embeddings
    const listings = await Listing.find(dbFilter).select("+embedding");

    // SOFT RANKING: semantic similarity within that filtered set
    const scored = listings
        .filter((l) => Array.isArray(l.embedding) && l.embedding.length)
        .map((l) => ({ listing: l, score: cosineSimilarity(queryVector, l.embedding) }));

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
}

module.exports = { retrieveListings, cosineSimilarity };