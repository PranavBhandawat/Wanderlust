const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app.js");
const User = require("../models/user.js");
const Listing = require("../models/listing.js");

let user;
let listing;

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust_test");

  // create a user (register hashes the password):
  user = await User.register(
    new User({ email: "a@a.com", username: "test" }),
    "pass123",
  );

  // create a listing owned by that user:
  listing = await Listing.create({
    title: "Test",
    price: 100,
    owner: user._id,
    description: "test des",
    location: "Jaipur, Rajasthan",
    country: "India",
    category: ["Trending"],
    geometry: { type: "Point", coordinates: [75.78, 26.91] },
  });
});

afterAll(async () => {
  await Listing.deleteMany({});
  await User.deleteMany({});

  await mongoose.connection.close();
});

describe("The /listings endpoint", () => {

  // Test Case 1
  test("returns status 200 and renders the listings page", async () => {
    const res = await request(app).get("/listings");
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain("Explore");
  });

  // Test Case 2
  test("returns status 200 and page contains the owner's username:", async () => {
    const res = await request(app).get(`/listings/${listing._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain(user.username);
  });

  // Test Case 3
  test("Listing not found hence returns status 400 ", async () => {
    const res = await request(app).get("/listings/randomListingId");
    expect(res.statusCode).toBe(400);
  });

});
