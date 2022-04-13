const express = require("express");
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const userController = require("../controllers/users");
const Racetrack = require("../models/racetrack");

const mapboxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken = process.env.MAPBOX_TOKEN;
const geocoder = mapboxGeocoding({ accessToken: mapboxToken });

router
  .route("/register")
  .get(userController.showRegisterForm)
  .post(catchAsync(userController.register));

router
  .route("/login")
  .get(userController.showLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    userController.logIn
  );

router.get("/logout", userController.logout);

module.exports = router;
