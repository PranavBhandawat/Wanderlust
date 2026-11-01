if(process.env.NODE_ENV != "production"){
    console.log(process.env.NODE_ENV);
    require('dotenv').config();
}
console.log(process.env.NODE_ENV);

const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo'); //connect-mongo with expreess-session helps when scaling the app
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/wanderlust"; //local database
const dbUrl = process.env.ATLASDB_URL; //Atlas database

async function main() {
  await mongoose.connect(dbUrl);
} 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: dbUrl, //whichever db is passed here either the local db (MONGO_URL) or mongo atlas' (dbUrl) that will be used
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24*3600, //touchAfter duration is provided in seconds
});

store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE!", err);
})

const sessionOptions = {
    store, //this refers to our MongoStore's store
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //to prevent CSS attacks
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

app.all("*splat", (req, res, next) => { // * -> *splat
    console.log("404 →", req.method, req.originalUrl);
    next(new ExpressError(404, "Page Not Found!"));
});

const handleCastErr = (err, req, res, next) => {
    console.log("Cast Error Occured");
    console.log("handleCastErr fn");
    let message = "Invalid Listing ID";
    let statusCode = 400;
    res.status(statusCode).render("error.ejs", { message });
}

const handleValidationErr = (err, req, res, next) => {
    console.log("Validation Error Occured");
    console.log("handleValidationErr fn");
    let message = err.message;  ;
    let statusCode = 400;
    res.status(statusCode).render("error.ejs", { message });
}

//Error Handling Middleware
app.use((err, req, res, next) => {
    console.log(err.name);
    let {statusCode = 500, message = "Something went Wrong!"} = err;

    if(err.name === "CastError"){
        return handleCastErr(err, req, res, next);
    }
    if(err.name === "ValidationError"){
        return handleValidationErr(err, req, res, next);
    }
    console.log("Middleware");
    console.log(err.name);
    console.log(err);
    res.status(statusCode).render("error.ejs", { message });
});

// Only start the server when run directly, not when imported by a test
if (require.main === module) {
    main()
        .then(() => console.log("Connected to DB"))
        .catch(err => console.log(err));

    app.listen(8080, () => {
        console.log("Server is listening on port 8080 after test edit");
    });
}

module.exports = app;