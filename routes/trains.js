const express = require("express");
const pool = require("../config/db");
const { auth } = require("../middleware/auth");
const { getAllTrainsHandeler } = require("../controllers/train");
const router = express.Router();



router.get("/",auth, getAllTrainsHandeler);

module.exports = router;