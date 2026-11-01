# Wanderlust

> A full-stack accommodation-listing platform (Airbnb-style) where users can discover, list, and review stays — featuring an **AI-powered search concierge** that understands natural-language queries.

**🔗 Live Demo: [wanderlust-lkwa.onrender.com/listings](https://wanderlust-lkwa.onrender.com/listings)**

> ⏳ *Note: the app is hosted on a free tier that sleeps after inactivity — the first load may take ~30–50 seconds to wake up, then it's fast.*

---

## Overview

Wanderlust is a server-rendered web application where travelers can browse property listings, view them on an interactive map, read and write reviews, and create their own listings with image uploads. Beyond standard search, it includes a **Retrieval-Augmented Generation (RAG) concierge**: type something like *"a cozy mountain cabin in India"* and the app semantically ranks matching listings and generates a natural-language recommendation.

---

## Features

- **Full CRUD for listings** — create, read, update, and delete stays, with image uploads handled via Cloudinary.
- **Authentication & authorization** — sign up / log in with Passport.js; only a listing's owner can edit or delete it, and only logged-in users can review.
- **Reviews & ratings** — users leave star ratings and comments, with author-only deletion.
- **Interactive maps** — each listing is geocoded and displayed on a Mapbox map.
- **AI Search Concierge (RAG)** — semantic, natural-language search that retrieves relevant listings and generates a tailored recommendation.
- **Responsive UI** — built with Bootstrap 5, works across mobile and desktop.
- **Flash messaging & robust error handling** — clear user feedback and centralized error middleware.

---

## The AI Concierge (RAG) — How It Works

The search feature combines classic retrieval with a language model:

1. **Embeddings (local, cost-efficient):** Each listing is converted into a 384-dimension vector using the `all-MiniLM-L6-v2` model via **Hugging Face Transformers.js** (run locally), so high-volume embedding is free.
2. **Retrieval (hybrid search):** A user's query is embedded and compared against stored listing vectors using **cosine similarity**, combined with a structured filter on location/country for accuracy.
3. **Generation:** The top-ranked listings are passed as context to the **Groq API** (`openai/gpt-oss-20b`), which produces a grounded, conversational recommendation.

This design keeps costs low — only the low-volume generation step hits a paid API, while the high-volume embedding runs locally.

---

## Tech Stack

| Layer | Technologies |
|--|--|
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose (MongoDB Atlas in production) |
| **Templating** | EJS, ejs-mate |
| **Authentication** | Passport.js, passport-local-mongoose, express-session, connect-mongo |
| **Image Uploads** | Cloudinary, Multer |
| **Maps** | Mapbox |
| **AI / Search** | Hugging Face Transformers.js (embeddings), Groq API (generation) |
| **Validation** | Joi |
| **Frontend** | Bootstrap 5 |
| **DevOps** | Docker, Render |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20+)
- A [MongoDB](https://www.mongodb.com/atlas) database (local or Atlas)
- Accounts/API keys for **Cloudinary**, **Mapbox**, and **Groq**

### Installation

```bash
# Clone the repository
git clone https://github.com/PranavBhandawat/Wanderlust.git
cd Wanderlust

# Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following keys (this file is gitignored — never commit your secrets):

```env
ATLASDB_URL=your_mongodb_connection_string
SECRET=your_session_secret

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API_KEY=your_cloudinary_api_key
CLOUD_API_SECRET=your_cloudinary_api_secret

MAP_TOKEN=your_mapbox_token
GROQ_API_KEY=your_groq_api_key
```

> Adjust the Cloudinary variable names to match those referenced in your `cloudConfig.js`.

### Seed the Database (optional)

To populate the database with sample listings and generate their embeddings:

```bash
node init/index.js            # seed sample listings
node init/embedListings.js    # generate embeddings for AI search
```

### Run the App

```bash
# Development (with auto-reload)
npx nodemon app.js

# Or standard start
node app.js
```

Visit **http://localhost:8080/listings** in your browser.

---

## Running with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build
```

The app is containerized via the included `Dockerfile` and deployed to **Render**, which rebuilds and redeploys automatically on every push to `main`.

---

## Project Structure

```
Wanderlust/
├── controllers/      # Route logic (listings, reviews, users)
├── init/             # DB seeding & embedding scripts
├── models/           # Mongoose schemas (listing, review, user)
├── public/           # Static assets (CSS, client-side JS)
├── routes/           # Express routers
├── utils/            # Helpers (RAG: embeddings, retrieve, generate; error handling)
├── views/            # EJS templates
├── Dockerfile
├── docker-compose.yml
├── app.js            # App entry point
└── schema.js         # Joi validation schemas
```

---

## Roadmap

- [ ] Google OAuth sign-in
- [ ] Payment integration (Stripe)
- [ ] Automated testing in CI (GitHub Actions)
- [ ] Booking & availability calendar

---

## Acknowledgements

Built as a major project while following the **Apna College** Full-Stack Web Development curriculum, extended with an **original RAG-based AI search feature**, **automated testing**, **tag-based filters**, **authorization-based ability to post reviews**, **various UI-based changes etc**.

---

## Author

**Pranav Bhandawat**
