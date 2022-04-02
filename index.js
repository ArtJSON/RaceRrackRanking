// if is in development
if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Racetrack = require("./models/racetrack");

const racetracks = require("./routes/racetracks");
const reviews = require("./routes/reviews");
const users = require("./routes/users");

// mongoose connection to mongoDB
mongoose
  .connect("mongodb://localhost:27017/racetrackDB")
  .then(() => {
    console.log("Racetack database connection open");
  })
  .catch((error) => {
    console.log("Error during connection to the racetrack database: ");
    console.log(error);
  });

// set express view engine to ejs and changed the default path of views dir
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// session configuration - needs to be changed in production
const sessionConfig = {
  secret: "someSecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    // Date.now() return date in miliseconds
    expires: Date.now() + 1000 * 60 * 60,
    maxAge: 1000 * 60 * 60,
  },
};
app.use(session(sessionConfig));
app.use(flash());

// passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", users);
app.use("/racetracks", racetracks);
app.use("/racetracks/:id/reviews", reviews);

app.get("/", async (req, res) => {
  const count = await Racetrack.count();
  const random = Math.floor(Math.random() * count);
  const racetrack = await Racetrack.findOne().skip(random);

  console.log(racetrack);
  res.render("index", { racetrack });
});

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = "No error message";
  }
  res.status(statusCode).render("error", { err });
});

app.listen(3333, () => {
  console.log("Listening on port 3333");
});
