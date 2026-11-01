const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Turn the retrieved listings into readable context for the LLM. (The "Augmented" step.)
function buildContext(results) {
    return results
        .map((r, i) => {
            const l = r.listing;
            return `Listing ${i + 1}:
- Title: ${l.title}
- Description: ${l.description}
- Category: ${(l.category || []).join(", ")}
- Location: ${l.location}, ${l.country}
- Price: ₹${l.price} per night`;
        })
        .join("\n\n");
}

async function generateRecommendation(query, results) {
    const context = buildContext(results);

    const systemPrompt = `You are Wanderlust's friendly travel concierge.Recommend places ONLY from the listings provided below. Never invent listings, prices, or details that are not given.
Refer to each place by its exact title. Keep it warm and concise (2-4 sentences), and briefly say why each suggestion fits the request. If none of the listings fit the request, say so honestly instead of forcing a match. Write in plain, friendly prose — no markdown, asterisks, bullet points, or headings.

Available listings:
${context}`;

    const completion = await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: query },
        ],
        temperature: 0.4,
        max_tokens: 400,
    });

    return completion.choices[0].message.content;
}

module.exports = { generateRecommendation, buildContext };