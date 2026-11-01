const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust";

main().then(async () => {
    console.log("Connected to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6ac5696de965fe96e6c2fbad", geometry: { type: "Point", coordinates: [77.09, 28.70] },  // default: Delhi
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
