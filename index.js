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
const calculateAvg = require("./utils/calculateAvg");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const Racetrack = require("./models/racetrack");
const mogoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { authAdmin } = require("./utils/middleware");

const MongoDBStore = require("connect-mongo")(session);

const racetracks = require("./routes/racetracks");
const reviews = require("./routes/reviews");
const users = require("./routes/users");
const admin = require("./routes/admin");

// env var
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/racetrackDB";
const secret = process.env.SECRET || "someSecret";
const port = process.env.PORT || 3000;

// mongoose connection to mongoDB
mongoose // "mongodb://localhost:27017/racetrackDB" or process.env.DB_URL
  .connect(dbUrl)
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
app.use(
  mogoSanitize({
    replaceWith: "_",
  })
);

//

const store = new MongoDBStore({
  url: dbUrl,
  secret: secret,
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("Session store error", e);
});

// session configuration - needs to be changed in production
const sessionConfig = {
  store: store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
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

// helmet config
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dixadtjff/",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dixadtjff/",
];
const connectSrcUrls = [
  "https://*.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://events.mapbox.com",
  "https://res.cloudinary.com/dixadtjff/",
];
const fontSrcUrls = ["https://res.cloudinary.com/dixadtjff/"];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dixadtjff/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
      mediaSrc: ["https://res.cloudinary.com/dixadtjff/"],
      childSrc: ["blob:"],
    },
  })
);

app.use("/", users);
app.use("/racetracks", racetracks);
app.use("/admin", admin);
app.use("/racetracks/:id/reviews", reviews);

app.get("/", async (req, res) => {
  const count = await Racetrack.count();
  const random = Math.floor(Math.random() * count);
  const racetrack = await Racetrack.findOne().skip(random).populate("reviews");

  calculateAvg([racetrack]);
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

app.listen(port, () => {
  console.log("Listening on port", port);
});
