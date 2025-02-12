const express = require("express");
const { registrationHandeler, loginHandeler } = require("../controllers/auth");
const router = express.Router();



router.post("/register",registrationHandeler);
router.post("/login",loginHandeler );

module.exports = router;
