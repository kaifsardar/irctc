const express = require("express");
const { addTrainHandeler } = require("../controllers/admin");
const { admin } = require("../middleware/admin");
const router = express.Router();


router.post("/train",admin, addTrainHandeler);

module.exports = router;
