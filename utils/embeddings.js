let extractorPromise = null;

async function getExtractor() {
    if (!extractorPromise) {
        const { pipeline } = await import("@huggingface/transformers");

        extractorPromise = pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2", {
            progress_callback: (p) => {
                if (p.status === "progress") {
                    console.log(`${p.file} — ${Math.round(p.progress)}%`);
                }
            },
        });
    }
    return extractorPromise;
}

// Turn any text into a 384-number embedding vector.
async function embed(text) {
    const extractor = await getExtractor();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    // output.data is a Float32Array; convert to a plain JS array for Mongo + math.
    return Array.from(output.data);
}

// Build the text we embed for a listing — combine its meaningful fields.
function listingToText(listing) {
    return [
        listing.title,
        listing.description,
        (listing.category || []).join(", "),
        listing.location,
        listing.country,
    ].filter(Boolean).join(". ");
}

module.exports = { embed, listingToText };