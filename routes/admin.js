const { authAdmin } = require("../utils/middleware");
const catchAsync = require("../utils/catchAsync");
const adminController = require("../controllers/admin");

const express = require("express");
const router = express.Router();

router.get("/", authAdmin, async (req, res) => {
  res.render("admin/index");
});

module.exports = router;
